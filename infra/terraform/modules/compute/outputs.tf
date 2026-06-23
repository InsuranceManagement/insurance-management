output "backend_vm_public_ip" {
  value = azurerm_public_ip.backend.ip_address
}

output "backend_vm_ssh_command" {
  value = "ssh ${var.admin_username}@${azurerm_public_ip.backend.ip_address}"
}

output "backend_api_url" {
  value = "http://${azurerm_public_ip.backend.ip_address}:8080"
}
