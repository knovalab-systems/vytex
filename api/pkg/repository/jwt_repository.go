package repository

import "github.com/knovalab-systems/vytex/pkg/utils"

type TokensRepository interface {
	GenerateTokens(string) (*utils.Tokens, error)
}
