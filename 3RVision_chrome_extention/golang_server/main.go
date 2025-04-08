package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Product struct {
	Title string `json:"title"`
}

func main() {
	http.HandleFunc("/filter", filterHandler)
	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func filterHandler(w http.ResponseWriter, r *http.Request) {
	var products []Product
	err := json.NewDecoder(r.Body).Decode(&products)
	if err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	var filtered []Product
	for _, p := range products {
		if isEcoFriendly(p.Title) {
			filtered = append(filtered, p)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filtered)
}
