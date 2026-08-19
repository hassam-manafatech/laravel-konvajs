export type FurnitureCategory =
    | 'seating'
    | 'table'
    | 'counter'
    | 'desk'
    | 'fixture';

export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'checked_in'
    | 'completed'
    | 'cancelled';

export type TemplateType = 'cafe' | 'co_working' | 'boutique' | 'restaurant';

export type FurnitureRenderShape = 'round' | 'rect' | 'chair' | 'stool' | 'plant' | 'shelf';

export type FurnitureRenderMetadata = {
    shape?: FurnitureRenderShape;
    brand_accent?: boolean;
};

export type FurnitureCatalogItem = {
    id: number;
    name: string;
    category: FurnitureCategory;
    width_m: string;
    depth_m: string;
    height_m: string;
    price: string;
    seat_capacity: number;
    default_color: string;
    render_metadata: FurnitureRenderMetadata | null;
    created_at: string | null;
    updated_at: string | null;
};

export type ProjectItem = {
    id: number;
    project_id: number;
    furniture_id: number;
    group_id: string | null;
    x_coord: string;
    y_coord: string;
    rotation: number;
    custom_color: string | null;
    meta_data: Record<string, unknown> | null;
    created_at: string | null;
    updated_at: string | null;
    furniture?: FurnitureCatalogItem;
};

export type Reservation = {
    id: number;
    project_id: number;
    table_item_id: number;
    group_id: string | null;
    customer_name: string;
    reservation_time: string;
    status: ReservationStatus;
    total_chairs_in_group: number;
    reserved_chairs_count: number;
    created_at: string | null;
    updated_at: string | null;
    chairs?: ProjectItem[];
};

export type EgressPathPoint = {
    x: number;
    y: number;
};

export type EgressPath = {
    id: number;
    project_id: number;
    path_points: EgressPathPoint[];
    door_label: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type Template = {
    id: number;
    name: string;
    type: TemplateType;
    default_width_m: string;
    default_height_m: string;
    thumbnail_url: string | null;
    layout_data: Record<string, unknown> | null;
    created_at: string | null;
    updated_at: string | null;
};

export type Project = {
    id: number;
    user_id: number;
    template_id: number | null;
    name: string;
    width_m: string;
    height_m: string;
    brand_color: string;
    show_blueprint_grid: boolean;
    total_seats: number;
    total_cost: string;
    fire_safety_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    items?: ProjectItem[];
    reservations?: Reservation[];
    egressPaths?: EgressPath[];
};

export type SyncProjectItemInput = {
    id?: number;
    furniture_id?: number;
    x_coord: number;
    y_coord: number;
    rotation?: number;
    custom_color?: string | null;
    meta_data?: Record<string, unknown> | null;
};

export type ReservationPayload = {
    project_item_id: number;
    customer_name: string;
    reservation_time: string;
};
