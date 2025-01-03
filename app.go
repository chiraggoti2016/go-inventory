package main

import (
	"context"
	// "fmt"
	"encoding/json"
	"log"
	"time"
	
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Item represents inventory item
type Item struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Quantity    int       `json:"quantity"`
	Price       float64   `json:"price"`
	Category    string    `json:"category"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// App struct
type App struct {
	ctx context.Context
	db  *gorm.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// db, err := gorm.Open(sqlite.Open("inventory.db"), &gorm.Config{})
	// Open SQLite database using the pure Go driver
	// db, err := gorm.Open(sqlite.Dialector{DSN: "file:test.db?cache=shared&_pragma=foreign_keys(1)"}, &gorm.Config{})

	dsn := "root:1234@tcp(127.0.0.1:3306)/goinventory?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to MySQL database: %v", err)
	}
	
	// Auto migrate the schema
	db.AutoMigrate(&Item{})
	a.db = db
}

// CreateItem adds a new item to inventory
func (a *App) CreateItem(jsonData string) string {
	var item Item
	json.Unmarshal([]byte(jsonData), &item)
	
	result := a.db.Create(&item)
	if result.Error != nil {
		return "Error creating item"
	}
	
	response, _ := json.Marshal(item)
	return string(response)
}

// GetItems returns all items
func (a *App) GetItems() string {
	var items []Item
	a.db.Find(&items)
	
	response, _ := json.Marshal(items)
	return string(response)
}

// UpdateItem updates an existing item
func (a *App) UpdateItem(jsonData string) string {
	var item Item
	json.Unmarshal([]byte(jsonData), &item)
	
	result := a.db.Save(&item)
	if result.Error != nil {
		return "Error updating item"
	}
	
	response, _ := json.Marshal(item)
	return string(response)
}

// DeleteItem removes an item
func (a *App) DeleteItem(id string) string {
	result := a.db.Delete(&Item{}, id)
	if result.Error != nil {
		return "Error deleting item"
	}
	return "Item deleted successfully"
}

// GetItemByID an item
func (a *App) GetItemByID(id uint) (*Item, error) {
	var item Item
	if err := a.db.First(&item, id).Error; err != nil {
        return nil, err // Handles record not found or other errors
    }
    return &item, nil
}