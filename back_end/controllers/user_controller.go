package controllers

import (
	"errors"
	"fmt"
	"my-project/initializers"
	"my-project/modules"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
)

// handles GET requests from the F.E. and return the users list in json form
func GetRequests(ctx *gin.Context) { //gin.context = all the info about the request

	var users_list []modules.User

	//select * from users => into a list(users_list)
	result := initializers.DB_ptr.Find(&users_list)

	if result.Error != nil {
		return
	}

	//will return the users_list in json form:
	ctx.IndentedJSON(http.StatusOK, users_list)

}

func CreateUser(ctx *gin.Context) {
	var newUser modules.User

	err := ctx.BindJSON(&newUser)
	if err != nil { //error
		ctx.JSON(http.StatusBadRequest,
			gin.H{"error": "user info not valid"}) //gin.H{} = a maping function: keys[string] : value[interface/any]

		return
	}

	//INSERT newuser by its pointer into users table:
	result := initializers.DB_ptr.Create(&newUser)
	if result.Error != nil {
		return
	}

	ctx.IndentedJSON(http.StatusCreated, newUser)
}

func GetUserById(id uint) (*modules.User, error) {

	var users_list []modules.User

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
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()}) //error
		return
	}
	ctx.IndentedJSON(http.StatusOK, User)
}

func Login(ctx *gin.Context) {

	var login_input struct {
		Email    string
		Password string
	}

	err := ctx.Bind(&login_input) //will take the json from the front, and converts it to login_input type
	if err != nil {               //if gin can't do the converstion it will show - StatusBadRequest
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "input not valid, please try again"})
		return
	}

	//the user that has the same email
	var login_user modules.User

	//select * from users where email = login_input.Email , First - will stop searching when found 1
	found := initializers.DB_ptr.First(&login_user, "email= ?", login_input.Email)
	if found.Error != nil { //not found - will return
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "email is not registered"})
		return
	}

	//will hash the inputed password, and compare to the same user's password from the DB
	err = bcrypt.CompareHashAndPassword([]byte(login_user.Password), []byte(login_input.Password))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "password incorrect"}) //לא בטוח איזה status
		return
	}

	//login info valid - will genarate a token:
	// Create a new token object, specifying signing method and the claims you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"subject":  login_user.User_id,
		"exp_date": time.Now().Add(time.Minute * 30).Unix(),
	})

	secret := viper.GetString("secret")

	// Sign in and get the complete encoded token as a string using the secret signature
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to create token"})
	}

	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("Authorization", tokenString, 1800, "", "", false, true) //30 minutes, httponly - onlye the browser and the server can read

	ctx.JSON(http.StatusOK, gin.H{"message": "cookie"})

}

func Register(ctx *gin.Context) {
	var register_input struct {
		User_name   string
		Email       string
		Password    string
		Permissions bool
	}

	err := ctx.Bind(&register_input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user details unaccesptable"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(register_input.Password), 10)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to hash the password"})
		return
	}

	newUser := modules.User{
		User_name: register_input.User_name,
		Email:     register_input.Email,
		Password:  string(hash)}

	result := initializers.DB_ptr.Create(&newUser)
	
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to register new user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"messge": "new user registerd and saved in tha database"})
}

func Validate(ctx *gin.Context) {
	// get the userData from the local memmory of the router
	userData , exists := ctx.Get("user")
	if exists != true{
		ctx.JSON(http.StatusUnauthorized , gin.H{"error":"user dosn't have authintication"})
		return
	}
	//from gin user type to DB user type:
	user := userData.(modules.User)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "user validated",
		"user_name": user.User_name,
		"email": user.Email,
	})
}
