import { useState } from "react"

type UseEntityViewOptions<TData> = {
  selectedRows: TData[]
  isSingleSelection: boolean
  isEnabled?: boolean
}

export function useEntityView<TData>({
  selectedRows,
  isSingleSelection,
  isEnabled = true,
}: Readonly<UseEntityViewOptions<TData>>) {
  const [isEntityViewOpen, setIsEntityViewOpen] = useState(false)
  const [entityInView, setEntityInView] = useState<TData | null>(null)

  const handleViewEntityRecord = (entity: TData) => {
    if (!isEnabled) return

    setEntityInView(entity)
    setIsEntityViewOpen(true)
  }

  const handleViewEntity = () => {
    if (!isEnabled || !isSingleSelection) return

    const selectedEntity = selectedRows[0]

    if (!selectedEntity) return

    handleViewEntityRecord(selectedEntity)
  }

  const handleEntityViewOpenChange = (open: boolean) => {
    setIsEntityViewOpen(open)

    if (!open) {
      setEntityInView(null)
    }
  }

  return {
    isEntityViewOpen,
    entityInView,
    handleViewEntity,
    handleViewEntityRecord,
    handleEntityViewOpenChange,
  }
}
