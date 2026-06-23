terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

module "gateway" {
  source = "./modules/gateway"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  api_management_name = var.api_management_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
}

module "compute" {
  source = "./modules/compute"

  resource_group_name  = azurerm_resource_group.main.name
  location             = azurerm_resource_group.main.location
  admin_username       = var.admin_username
  admin_ssh_public_key = var.admin_ssh_public_key
}

module "kubernetes" {
  source = "./modules/kubernetes"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  cluster_name        = var.aks_cluster_name
  dns_prefix          = var.aks_dns_prefix
  node_count          = var.aks_node_count
  node_vm_size        = var.aks_node_vm_size
}
