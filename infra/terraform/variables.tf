variable "resource_group_name" {
  type    = string
  default = "rg-insurance-management"
}

variable "location" {
  type    = string
  default = "East US"
}

variable "api_management_name" {
  type    = string
  default = "apim-insurance-management"
}

variable "publisher_name" {
  type    = string
  default = "Lucas"
}

variable "publisher_email" {
  type    = string
  default = "l2727544@gmail.com"
}

variable "admin_username" {
  type    = string
  default = "azureuser"
}

variable "admin_ssh_public_key" {
  type        = string
  description = "Public SSH key allowed to access the frontend VM."
}
