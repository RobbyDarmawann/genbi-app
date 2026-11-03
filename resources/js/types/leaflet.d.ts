declare module 'leaflet' {
    export type LatLngTuple = [number, number];
    export type LatLngLiteral = { lat: number; lng: number };
    export type LatLngExpression = LatLng | LatLngLiteral | LatLngTuple;
    export type LatLngBoundsExpression = LatLngTuple[];

    export class LatLng {
        lat: number;
        lng: number;
        constructor(latitude: number, longitude: number, altitude?: number);
    }

    export interface FitBoundsOptions {
        padding?: [number, number];
        maxZoom?: number;
        animate?: boolean;
    }

    export interface LayerOptions {
        pane?: string;
        attribution?: string;
    }

    export interface InteractiveLayerOptions extends LayerOptions {
        interactive?: boolean;
        bubblingMouseEvents?: boolean;
    }

    export interface PathOptions extends InteractiveLayerOptions {
        stroke?: boolean;
        color?: string;
        weight?: number;
        opacity?: number;
        fill?: boolean;
        fillColor?: string;
        fillOpacity?: number;
        dashArray?: string | number[];
    }

    export interface CircleMarkerOptions extends PathOptions {
        radius?: number;
    }

    export interface CircleOptions extends PathOptions {
        radius: number;
    }

    export interface TileLayerOptions extends LayerOptions {
        minZoom?: number;
        maxZoom?: number;
        subdomains?: string | string[];
        zoomOffset?: number;
        opacity?: number;
    }

    export interface MapOptions {
        center?: LatLngExpression;
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        zoomControl?: boolean;
        attributionControl?: boolean;
        scrollWheelZoom?: boolean | 'center';
        dragging?: boolean;
        doubleClickZoom?: boolean | 'center';
    }

    export interface LeafletMouseEvent {
        latlng: LatLng;
        originalEvent: MouseEvent;
    }

    export interface LeafletEventHandlerFnMap {
        click?: (event: LeafletMouseEvent) => void;
    }

    export class Evented {}
    export class Layer extends Evented {}
    export class Path extends Layer {}
    export class FeatureGroup extends Layer {}
    export class TileLayer extends Layer {}
    export class Circle<P = unknown> extends Path {
        options: P;
    }
    export class CircleMarker<P = unknown> extends Path {
        options: P;
    }
    export class Marker<P = unknown> extends Layer {
        options: P;
    }

    export class Map extends Evented {
        setView(center: LatLngExpression, zoom?: number): this;
        getZoom(): number;
        invalidateSize(): this;
    }
}
