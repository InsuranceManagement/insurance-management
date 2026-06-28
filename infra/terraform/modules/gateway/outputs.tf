output "api_management_gateway_url" {
  value = azurerm_api_management.gateway.gateway_url
}

output "frontend_gateway_url" {
  value = azurerm_api_management.gateway.gateway_url
}

output "frontend_homolog_gateway_url" {
  value = "${azurerm_api_management.gateway.gateway_url}/homolog"
}

output "backend_homolog_gateway_url" {
  value = "${azurerm_api_management.gateway.gateway_url}/homolog/api"
}
