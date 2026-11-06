import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import {
    Circle,
    CircleMarker,
    LayerGroup,
    LayersControl,
    MapContainer,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';

type Props = {
    latitude: number;
    longitude: number;
    radius: number;
    readOnly?: boolean;
    onLocationChange?: (lat: number, lng: number) => void;
};

function MapClickHandler({
    onLocationChange,
}: {
    onLocationChange: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(event) {
            onLocationChange(
                Number(event.latlng.lat.toFixed(7)),
                Number(event.latlng.lng.toFixed(7)),
            );
        },
    });
    return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function LeafletPicker({
    latitude,
    longitude,
    radius,
    readOnly = false,
    onLocationChange,
}: Props) {
    const safeLat = Number.isFinite(latitude) ? latitude : 0.5435442;
    const safeLng = Number.isFinite(longitude) ? longitude : 123.0567972;
    const safeRadius = Number.isFinite(radius) && radius >= 10 ? radius : 100;
    const center: [number, number] = [safeLat, safeLng];

    return (
        <div className="relative z-0 h-72 w-full overflow-hidden rounded-md border">
            <MapContainer
                center={center}
                zoom={16}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <LayersControl>
                    <LayersControl.BaseLayer checked name="Jalan">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satelit">
                        <LayerGroup>
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
                            />
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                            />
                        </LayerGroup>
                    </LayersControl.BaseLayer>
                </LayersControl>
                {!readOnly && onLocationChange && (
                    <MapClickHandler onLocationChange={onLocationChange} />
                )}
                <MapUpdater center={center} />
                <Circle
                    center={center}
                    radius={safeRadius}
                    pathOptions={{
                        color: '#0035a0',
                        fillColor: '#0035a0',
                        fillOpacity: 0.2,
                        weight: 2,
                    }}
                />
                <CircleMarker
                    center={center}
                    radius={6}
                    pathOptions={{
                        color: '#ffffff',
                        fillColor: '#0035a0',
                        fillOpacity: 1,
                        weight: 2,
                    }}
                />
            </MapContainer>
        </div>
    );
}
