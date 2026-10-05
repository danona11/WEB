package middleware

import (
	"my-project/initializers"
	"my-project/modules"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// validates the user is who he is, so that when a user does an important task, it is defiently him.
// header: the hasing algorithm , and toket type(jwt)
// claims: the data - need the user id , token create date , token exp date , user perrmissions
// signature: a secret signature for all the tokens, to varify all tokens arr authentic.

func RequireAuth(ctx *gin.Context) {
	//get the cookie:
	tokenString, err := ctx.Cookie("Authorization")

	if err != nil {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	//decode the token and validate it:

	secret := os.Getenv("secret")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil

	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {

		//find the user with token claims -subject(incase he was deleted from the DB):
		var user modules.User
		initializers.DB_ptr.First(&user, claims["subject"])

		if user.UserID == 0 {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		//the data was already fetched, so it is saved to the request in the local memmory
		ctx.Set("user", user)

		//the cookie is valid and the user can make the request
		ctx.Next()
	} else {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

}
