output "api_management_gateway_url" {
  value = module.gateway.api_management_gateway_url
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "frontend_vm_public_ip" {
  value = module.compute.frontend_vm_public_ip
}

output "frontend_vm_ssh_command" {
  value = module.compute.frontend_vm_ssh_command
}

output "frontend_url" {
  value = module.compute.frontend_url
}
