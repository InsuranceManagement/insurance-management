output "cluster_name" {
  value = azurerm_kubernetes_cluster.main.name
}

output "kube_config_command" {
  value = "az aks get-credentials --resource-group ${var.resource_group_name} --name ${azurerm_kubernetes_cluster.main.name}"
}
