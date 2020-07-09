package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/lambdacontext"
	"log"
)

type IdentityResponse struct {
	Identity *Identity `json:"identity"`
	User     *User     `json:"user"`
	SiteUrl  string    `json:"site_url"`
	Alg      string    `json:"alg"`
}

type Identity struct {
	URL   string `json:"url"`
	Token string `json:"token"`
}

type User struct {
	AppMetaData  *AppMetaData  `json:"app_metadata"`
	Email        string        `json:"email"`
	Exp          int           `json:"exp"`
	Sub          string        `json:"sub"`
	UserMetadata *UserMetadata `json:"user_metadata"`
}
type AppMetaData struct {
	Provider string `json:"provider"`
}
type UserMetadata struct {
	FullName string `json:"full_name"`
}

type Response struct {
	Msg string `json:"msg"`
	IdentityResponse string `json:"identity_response"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	lc, ok := lambdacontext.FromContext(ctx)
	if !ok {
		return &events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "server error",
		}, nil
	}
	log.Printf("lc.ClientContext.Custom: %+v\n", lc.ClientContext.Custom)
	identityResponse := lc.ClientContext.Custom["netlify"]
	raw, _ := base64.StdEncoding.DecodeString(identityResponse)
	data := IdentityResponse{}
	_ = json.Unmarshal(raw, &data)
	if data.User == nil {
		r := &Response{
			Msg: fmt.Sprintf("Your claim isn't valid. Try logging in and resubmitting your request"),
			IdentityResponse: identityResponse,
		}
		resp, _ := json.Marshal(r)
		return &events.APIGatewayProxyResponse{
			StatusCode: 403,
			Body:       string(resp),
		}, nil
	}
	r := &Response{
		Msg:              fmt.Sprintf("Hi %s your is claim is valid", data.User.UserMetadata.FullName),
		IdentityResponse: identityResponse,
	}
	resp, _ := json.Marshal(r)
	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(resp),
	}, nil
}

func main() {
	lambda.Start(handler)
}
