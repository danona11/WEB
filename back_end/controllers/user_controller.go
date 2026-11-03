package controllers

import (
	//"errors"
	//"fmt"
	//"strconv"
	"my-project/initializers"
	"my-project/modules"
	"net/http"
	"os"
	"time"
	"my-project/dto/UsersDto"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"github.com/spf13/viper"
	"strconv"
)

func GetUsers(ctx *gin.Context){ //gin.context = all the info about the request

	var users_list []modules.User
	var usersPerPage int = viper.GetInt("pagination_per_page") //get the const number of kits per page from the config file

	pageString := ctx.Param("page") //take the page from the url
	page, err := strconv.Atoi(pageString)
	if err != nil || page < 1 {		//incase of an uknown page number - go to page 1
        page = 1
    }
		
	var totalUsers int64
	initializers.DB_ptr.Model(&modules.User{}).Count(&totalUsers)	//total useructs in the DB
	
	offset := (page - 1) * usersPerPage	//the first user in the page

	result := initializers.DB_ptr.Order("user_id asc").Limit(usersPerPage).Offset(offset).Find(&users_list) //limit of kitsPerPage constant users per page - pagingtation
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to fetch users in page" + pageString })
		return
	}

	maxPage := 1
    if totalUsers > 0 {
        maxPage = int( (totalUsers + int64(usersPerPage - 1) ) /int64(usersPerPage) )//calculate the max page number - if there are 13 useructs and 5 per page, maxPage = 3
	}
	
	var response []dto.GetUsersResponse
	for _, user := range users_list {
		
		userRes := dto.GetUsersResponse{
			UserID: 		user.UserID,
			UserName:		user.UserName,
			Email:			user.Email,
			Permissions:	user.Permissions,
			CreatedAt:		user.CreatedAt,
		}

		response = append(response, userRes)
	}

	//will return the users_list in json form:
	ctx.JSON(http.StatusOK, gin.H{ "Users":response , "MaxPage": maxPage , "UsersPerPage": usersPerPage })

}

func SendLogin(ctx *gin.Context) {

	var login_input dto.LoginRequest

	err := ctx.Bind(&login_input) //will take the json from the front, and convert it to login_input type
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "input not valid, please try again"})
		return
	}

	var login_user modules.User

	//select * from users where user_name = login_input.user_name , First - will stop searching when found 1
	found := initializers.DB_ptr.First(&login_user, "user_name = ?", login_input.UserName)
	if found.Error != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user name is not registered"})
		return
	}

	//will hash the inputed password with his salt, and compare to the same user's password from the DB:
	err = bcrypt.CompareHashAndPassword([]byte(login_user.Password), []byte(login_input.Password))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "password incorrect"})
		return
	}

	//login info valid - will genarate a token with the userID and exp:
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"subject": login_user.UserID,
		"exp":     time.Now().Add(time.Minute * 30).Unix(),
	})
	secret := os.Getenv("secret")

	// Sign in and get the complete encoded token as a string using the secret signature
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to create token"})
		return
	}

	//packs the token into a cookie - which the browser will attach to every request
	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("Authorization", tokenString, 1800, "/", "", false, true) //30 minutes, httponly - onlye the browser and the server can read

	var userResponse = dto.LoginResponse{
		UserName: login_user.UserName ,
		Permissions: login_user.Permissions, }

	//sends the cookie to the front, so the front can read it and store the user name and permissions
	ctx.JSON(http.StatusOK, gin.H{ "user": userResponse })
}

func SendSignUp(ctx *gin.Context) {

	var userDetails modules.User

	err := ctx.Bind(&userDetails)
	if err != nil { //couldnt bind into userDetails
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user details unaccesptable"})
		return
	}

	found := initializers.DB_ptr.First(&userDetails, "user_name = ?", userDetails.UserName)
	if found != nil{
		ctx.JSON(http.StatusConflict, gin.H{"error": "username already exists"})
		return
	}

	//bcrypt will hash the users passwords in the db: will generate a 22dig salt, and encrypt the password to a combined string of the both: (salt+hash)
	hash, err := bcrypt.GenerateFromPassword([]byte(userDetails.Password), 10) //10(cost)- how slow the hashing alg will be
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to hash the password"})
		return
	}

	newUser := modules.User{
		UserName: userDetails.UserName,
		Email:    userDetails.Email,
		Password: string(hash),
		Permissions: false,
	}

	result := initializers.DB_ptr.Create(&newUser)

	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to register new user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"messge": "new user registerd and saved in tha database"})
}

// validate the user is who he is, so that when a user does an important task, it is defiently him.
func Validate(ctx *gin.Context) {
	// get the userData from the local memmory of the router
	userData, exists := ctx.Get("user")
	if exists != true {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user dosn't have authintication"})
		return
	}

	//from gin user type to DB user type:
	user := userData.(modules.User)

	ctx.JSON(http.StatusOK, gin.H{
		"UserName":    user.UserName,
		"Permissions": user.Permissions,
	})
}

func Logout(ctx *gin.Context) {

	// 		cookie: ( name , value , maxAge , path , domain , secure , http-only )
	ctx.SetCookie( "Authorization" , "" , -1 , "/" , "localhost" , false , true)//the cookie has max age of -1 so the browser will automaticly delete it.
	ctx.JSON(http.StatusOK, gin.H{"msg":"user logged out and cookie deleted"} )

}


func UpdateUser(ctx *gin.Context) {
	//getting the user id off the URL:
	user_id := ctx.Param("id")

	var upd_user modules.User	//the updated fields
	ctx.Bind(&upd_user)
	
	var old_user modules.User

	//select user from where id = user_id:
	result := initializers.DB_ptr.First(&old_user, user_id)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find user"})
		return
	}

	initializers.DB_ptr.Model(&old_user).Updates(modules.User{
			
		UserName:		upd_user.UserName,
		Email:			upd_user.Email,
		Permissions:	upd_user.Permissions,
	})

	ctx.JSON(200, gin.H{"Update": old_user})
}

func DeleteUser(ctx *gin.Context) {
	//getting the user id off the URL:
	userID := ctx.Param("id")

	result := initializers.DB_ptr.Delete(&modules.User{}, userID)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find user to delete"})
		return
	}

	ctx.JSON(200, gin.H{"message": "successfully deleted user"})
}

/*
func CreateUser(ctx *gin.Context) {
	var newUser modules.postgersStructures.User

	err := ctx.BindJSON(&newUser)
	if err != nil {
		ctx.JSON(http.StatusBadRequest,
			gin.H{"error": "user info not valid"})

		return
	}

	//INSERT newuser by its pointer into users table:
	result := initializers.DB_ptr.Create(&newUser)
	if result.Error != nil {
		return
	}

	ctx.IndentedJSON(http.StatusCreated, newUser)
}

func GetUserById(id uint) (*modules.postgersStructures.User, error) {

	var users_list []modules.postgersStructures.User

	//select * from users => into a list(users_list)
	result := initializers.DB_ptr.Find(&users_list)
	if result.Error != nil {
		return nil, result.Error
	}
	fmt.Print(users_list)

	for i, User := range users_list {
		if User.User_id == id {
			return &users_list[i], nil //will return the pointer to the User with that id , and no error
		}
	}
	return nil, errors.New("User not found")
}

func UserById(ctx *gin.Context) {
	ids := ctx.Param("User_id")

	id, err := strconv.Atoi(ids)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User id has to be a whole positive number"}) //error
		return
	}

	User, err := GetUserById(uint(id))

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	ctx.IndentedJSON(http.StatusOK, User)
}
*/