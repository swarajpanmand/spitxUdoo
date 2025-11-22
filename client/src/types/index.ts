export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Inventory Manager' | 'Warehouse Staff';
    permissions: string[];
    department?: string;
    isActive: boolean;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    unitOfMeasure: string;
    stockLevel: number;
    reorderPoint?: number;
    locations: StockLocation[];
    createdAt: string;
    updatedAt: string;
}

export interface StockLocation {
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    rack?: string;
}

export interface Warehouse {
    id: string;
    name: string;
    code: string;
    address?: string;
    isActive: boolean;
}

export interface Receipt {
    id: string;
    receiptNumber: string;
    supplier: string;
    status: DocumentStatus;
    items: ReceiptItem[];
    receivedDate?: string;
    createdAt: string;
    createdBy: string;
}

export interface ReceiptItem {
    productId: string;
    productName: string;
    quantity: number;
    warehouseId: string;
}

export interface DeliveryOrder {
    id: string;
    orderNumber: string;
    customer: string;
    status: DocumentStatus;
    items: DeliveryItem[];
    deliveryDate?: string;
    createdAt: string;
    createdBy: string;
}

export interface DeliveryItem {
    productId: string;
    productName: string;
    quantity: number;
    warehouseId: string;
    picked: boolean;
    packed: boolean;
}

export interface InternalTransfer {
    id: string;
    transferNumber: string;
    sourceWarehouse: string;
    destinationWarehouse: string;
    status: DocumentStatus;
    items: TransferItem[];
    transferDate?: string;
    createdAt: string;
    createdBy: string;
}

export interface TransferItem {
    productId: string;
    productName: string;
    quantity: number;
}

export interface InventoryAdjustment {
    id: string;
    adjustmentNumber: string;
    productId: string;
    productName: string;
    warehouseId: string;
    warehouseName: string;
    recordedQuantity: number;
    countedQuantity: number;
    difference: number;
    reason?: string;
    createdAt: string;
    createdBy: string;
}

export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
    quantity: number;
    warehouseId: string;
    warehouseName: string;
    referenceNumber: string;
    createdAt: string;
    createdBy: string;
}

export type DocumentStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';

export type DocumentType = 'receipts' | 'deliveries' | 'transfers' | 'adjustments';

export interface DashboardKPI {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    pendingReceipts: number;
    pendingDeliveries: number;
    scheduledTransfers: number;
}

export interface FilterOptions {
    documentType?: DocumentType;
    status?: DocumentStatus;
    warehouse?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
}
