package main

import "strings"

func isEcoFriendly(title string) bool {
	title = strings.ToLower(title)
	keywords := []string{"eco-friendly", "biodegradable", "recyclable", "compostable", "organic"}
	for _, kw := range keywords {
		if strings.Contains(title, kw) {
			return true
		}
	}
	return false
}
