output "frontend_vm_public_ip" {
  value = azurerm_public_ip.frontend.ip_address
}

output "frontend_vm_ssh_command" {
  value = "ssh ${var.admin_username}@${azurerm_public_ip.frontend.ip_address}"
}

output "frontend_url" {
  value = "http://${azurerm_public_ip.frontend.ip_address}:3000"
}
