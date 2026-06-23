variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "admin_ssh_public_key" {
  type        = string
  description = "Public SSH key allowed to access the frontend VM."
}
