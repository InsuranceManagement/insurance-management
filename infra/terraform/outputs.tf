output "api_management_gateway_url" {
  value = module.gateway.api_management_gateway_url
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "backend_vm_public_ip" {
  value = module.compute.backend_vm_public_ip
}

output "backend_vm_ssh_command" {
  value = module.compute.backend_vm_ssh_command
}

output "backend_api_url" {
  value = module.compute.backend_api_url
}
