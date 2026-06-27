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
  default     = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDmQMY/jFHoafFftEe/2zYVziKq6cWDoo8+SYh9FyY3KaX867PLAi5yw+ZhykohmIKlnQuZIA3So04UhtGvkdp1RQxsD/sCLyxSqThXiIMHA4M3XDL3HqJrPz53J09DXgtTa4k8/P7JPQMFdHO48X1mMNyfaRD0cChcyWw9w9TDWnl86gzy2RJpeCHIAuf+/cZlE6e87IpE4lzvjvrI8mijuzJ+r1WYSSI3CngGFHvDfPN0/5uZj+tylqSz/DpazKtTUXyngr1o1uNAChWH6LVcSu+JLdM3/cpPBr8GMooceF1AiWtRjqwxuOcGBKYheZjz94xvozsvKhZohoFC2PU7RXfEJwllzBzp5JhmO5Dx/dQmfC0w8MDQbapy+PKx31zmdDB7wBuA/EmBPucP9hyXTmpzP9DQekCqvzcnypWuUZZkHB8+i4b9kH38LrYLHKObbt2TDhDbQlFc3p5Jcn4H9BDVSjOOi4DTveDvWzp1p1hTUnj8MmIuUpV0tV7ITD1/RRlq7SD+lZSvtLes7uKpEnzuJ813sizCSucqb/Ma70DSiLjdzp5PPkpxM23FfPsd18S+ki0O8n7dkBiRerCjfC/3ukfYf9p7axb0c1DG7sSZudnt/eZUVL8HYj0voxlakEpCb6JXnYpl1NTBGOXgteAeTqkG5XE8qTIGkjbbRw== lucas.castelano@radixeng.com"
  description = "Public SSH key allowed to access the frontend VM."
}

variable "backend_url" {
  type    = string
  default = "http://172.168.58.147/api"
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
