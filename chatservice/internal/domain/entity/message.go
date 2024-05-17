package entity

import (
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/pkoukk/tiktoken-go"
	"github.com/sashabaranov/go-openai"
)

type Message struct {
	ID        string
	Role      string
	Content   string
	Tokens    int
	Model     *Model
	CreatedAt time.Time
}

func NewMessage(role, content string, model *Model, messages []openai.ChatCompletionMessage) (*Message, error) {
	// Ensure the model is set to gpt-4-turbo by default if it's not already set
	if model.Name == "" {
		model.Name = "gpt-4-turbo"
	} else if !strings.HasPrefix(model.Name, "gpt-4") && !strings.HasPrefix(model.Name, "gpt-4-turbo") {
		// Force the model to gpt-4-turbo if not already set to a gpt-4 variant
		model.Name = "gpt-4-turbo"
	}
	totalTokens := NumTokensFromMessages(messages, model.Name)
	msg := &Message{
		ID:        uuid.New().String(),
		Role:      role,
		Content:   content,
		Tokens:    totalTokens,
		Model:     model,
		CreatedAt: time.Now(),
	}
	if err := msg.Validate(); err != nil {
		return nil, err
	}
	return msg, nil
}

func (m *Message) Validate() error {
	if m.Role != "user" && m.Role != "system" && m.Role != "assistant" {
		return errors.New("invalid role")
	}
	if m.Content == "" {
		return errors.New("content is empty")
	}
	if m.CreatedAt.IsZero() {
		return errors.New("invalid created at")
	}
	return nil
}

func (m *Message) GetQtdTokens() int {
	return m.Tokens
}

func NumTokensFromMessages(messages []openai.ChatCompletionMessage, model string) (numTokens int) {
	log.Printf("Using model version: %s", model)
	tkm, err := tiktoken.EncodingForModel(model)
	if err != nil {
		err = fmt.Errorf("encoding for model: %v", err)
		log.Println(err)
		return
	}

	var tokensPerMessage, tokensPerName int
	switch model {
	case
		"gpt-4-turbo-16k-0613",
		"gpt-4-0613",
		"gpt-3.5-turbo-0613",
		"gpt-3.5-turbo-16k-0613",
		"gpt-4-0314",
		"gpt-4-32k-0314",
		"gpt-4-32k-0613",
		"gpt-4-turbo-0613": // Novas versões do GPT-4-turbo
		tokensPerMessage = 3
		tokensPerName = 1
	case "gpt-3.5-turbo-0301":
		tokensPerMessage = 4 // every message follows <|start|>{role/name}\n{content}<|end|>\n
		tokensPerName = -1   // if there's a name, the role is omitted
	default:
		if strings.Contains(model, "gpt-3.5-turbo") {
			log.Println("warning: gpt-3.5-turbo may update over time. Returning num tokens assuming gpt-3.5-turbo-0613.")
			return NumTokensFromMessages(messages, "gpt-3.5-turbo-0613")
		} else if strings.Contains(model, "gpt-4") {
			log.Println("warning: gpt-4 may update over time. Returning num tokens assuming gpt-4-0613.")
			return NumTokensFromMessages(messages, "gpt-4-0613")
		} else {
			err = fmt.Errorf("num_tokens_from_messages() is not implemented for model %s. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.", model)
			log.Println(err)
			return
		}
	}

	for _, message := range messages {
		numTokens += tokensPerMessage
		numTokens += len(tkm.Encode(message.Content, nil, nil))
		numTokens += len(tkm.Encode(message.Role, nil, nil))
		numTokens += len(tkm.Encode(message.Name, nil, nil))
		if message.Name != "" {
			numTokens += tokensPerName
		}
	}
	numTokens += 3 // every reply is primed with <|start|>assistant<|message|>
	return numTokens
}
