variable "resource_group_name" {
  type    = string
  default = "rg-insurance-management"
}

variable "location" {
  type    = string
  default = "East US"
}

variable "aks_location" {
  type    = string
  default = "Central US"
}

variable "compute_location" {
  type    = string
  default = "Chile Central"
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

variable "frontend_vm_size" {
  type    = string
  default = "Standard_D2s_v3"
}

variable "admin_ssh_public_key" {
  type        = string
  description = "Public SSH key allowed to access the frontend VM."
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM+s4N4m/gEBlMVW+Ac8MHVmez+xv6FoGPCu31WdufJl radixengrj\\lucas.castelano@NX4XLFD33"
}

variable "backend_url" {
  type    = string
  default = "http://172.168.58.147/api"
}

variable "backend_homolog_url" {
  type    = string
  default = "http://172.168.58.147/homolog/api"
}

variable "aks_cluster_name" {
  type    = string
  default = "aks-insurance-backend"
}

variable "aks_dns_prefix" {
  type    = string
  default = "insurance-backend"
}

variable "aks_node_count" {
  type    = number
  default = 2
}

variable "aks_node_vm_size" {
  type    = string
  default = "Standard_D2s_v3"
}
