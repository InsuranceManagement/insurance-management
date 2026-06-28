resource "azurerm_api_management" "gateway" {
  name                = var.api_management_name
  location            = var.location
  resource_group_name = var.resource_group_name

  publisher_name  = var.publisher_name
  publisher_email = var.publisher_email

  sku_name = "Developer_1"
}

locals {
  backend_extra_methods = toset(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
}

resource "azurerm_api_management_api" "frontend" {
  name                  = "frontend"
  resource_group_name   = var.resource_group_name
  api_management_name   = azurerm_api_management.gateway.name
  revision              = "1"
  display_name          = "Frontend"
  path                  = ""
  protocols             = ["http", "https"]
  service_url           = var.frontend_url
  subscription_required = false
}

resource "azurerm_api_management_api_operation" "frontend_root" {
  operation_id        = "frontend-root"
  api_name            = azurerm_api_management_api.frontend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Frontend Root"
  method              = "GET"
  url_template        = "/"
}

resource "azurerm_api_management_api_operation" "frontend" {
  operation_id        = "frontend"
  api_name            = azurerm_api_management_api.frontend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Frontend"
  method              = "GET"
  url_template        = "/{*path}"

  template_parameter {
    name     = "path"
    required = true
    type     = "string"
  }
}

resource "azurerm_api_management_api" "frontend_homolog" {
  name                  = "frontend-homolog"
  resource_group_name   = var.resource_group_name
  api_management_name   = azurerm_api_management.gateway.name
  revision              = "1"
  display_name          = "Frontend Homolog"
  path                  = "homolog"
  protocols             = ["http", "https"]
  service_url           = var.frontend_homolog_url
  subscription_required = false
}

resource "azurerm_api_management_api_operation" "frontend_homolog_root" {
  operation_id        = "frontend-homolog-root"
  api_name            = azurerm_api_management_api.frontend_homolog.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Frontend Homolog Root"
  method              = "GET"
  url_template        = "/"
}

resource "azurerm_api_management_api_operation" "frontend_homolog" {
  operation_id        = "frontend-homolog"
  api_name            = azurerm_api_management_api.frontend_homolog.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Frontend Homolog"
  method              = "GET"
  url_template        = "/{*path}"

  template_parameter {
    name     = "path"
    required = true
    type     = "string"
  }
}

resource "azurerm_api_management_api" "backend" {
  name                  = "backend"
  resource_group_name   = var.resource_group_name
  api_management_name   = azurerm_api_management.gateway.name
  revision              = "1"
  display_name          = "Backend"
  path                  = "api"
  protocols             = ["http", "https"]
  service_url           = var.backend_url
  subscription_required = false
}

resource "azurerm_api_management_api_operation" "backend_root" {
  operation_id        = "backend-root"
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Backend Root"
  method              = "GET"
  url_template        = "/"
}

resource "azurerm_api_management_api_operation" "backend" {
  operation_id        = "backend"
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Backend"
  method              = "GET"
  url_template        = "/{*path}"

  template_parameter {
    name     = "path"
    required = true
    type     = "string"
  }
}

resource "azurerm_api_management_api" "backend_homolog" {
  name                  = "backend-homolog"
  resource_group_name   = var.resource_group_name
  api_management_name   = azurerm_api_management.gateway.name
  revision              = "1"
  display_name          = "Backend Homolog"
  path                  = "homolog/api"
  protocols             = ["http", "https"]
  service_url           = var.backend_homolog_url
  subscription_required = false
}

resource "azurerm_api_management_api_operation" "backend_homolog_root" {
  operation_id        = "backend-homolog-root"
  api_name            = azurerm_api_management_api.backend_homolog.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Backend Homolog Root"
  method              = "GET"
  url_template        = "/"
}

resource "azurerm_api_management_api_operation" "backend_homolog" {
  operation_id        = "backend-homolog"
  api_name            = azurerm_api_management_api.backend_homolog.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Backend Homolog"
  method              = "GET"
  url_template        = "/{*path}"

  template_parameter {
    name     = "path"
    required = true
    type     = "string"
  }
}

resource "azurerm_api_management_api_operation" "backend_homolog_extra_methods" {
  for_each = local.backend_extra_methods

  operation_id        = "backend-homolog-${lower(each.value)}"
  api_name            = azurerm_api_management_api.backend_homolog.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Backend Homolog ${each.value}"
  method              = each.value
  url_template        = "/{*path}"

  template_parameter {
    name     = "path"
    required = true
    type     = "string"
  }
}

resource "azurerm_api_management_api_operation" "backend_extra_methods" {
  for_each = local.backend_extra_methods

  operation_id        = "backend-${lower(each.value)}"
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name
  display_name        = "Backend ${each.value}"
  method              = each.value
  url_template        = "/{*path}"

  template_parameter {
    name     = "path"
    required = true
    type     = "string"
  }
}
