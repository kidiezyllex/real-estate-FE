"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IconMapPin, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix biểu tượng mặc định của Leaflet trong môi trường bundler
// Sử dụng CDN để tránh phải xử lý file tĩnh
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface GoogleMapLocationPickerProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
  className?: string;
  readOnly?: boolean;
}

const LeafletEvents: React.FC<{ onPick: (lat: number, lng: number, address: string) => void }> = ({ onPick }) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const address = await reverseGeocode(lat, lng);
      onPick(lat, lng, address);
    },
  });
  return null;
};

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data?.display_name || `${lat}, ${lng}`;
  } catch {
    return `${lat}, ${lng}`;
  }
}

async function geocode(query: string): Promise<{ lat: number; lng: number; address: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), address: first.display_name };
    }
    return null;
  } catch {
    return null;
  }
}

const vietnamCenter: LatLngExpression = [14.0583, 108.2772];

const MapComponent: React.FC<{
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
  searchInput: string;
  setSearchInput: (v: string) => void;
  readOnly?: boolean;
}> = ({ onLocationSelect, initialAddress, initialLat, initialLng, searchInput, setSearchInput, readOnly = false }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [markerPos, setMarkerPos] = useState<LatLngExpression | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  // Auto-geocode when in readOnly mode and have initialAddress
  useEffect(() => {
    if (readOnly && initialAddress && !initialLat && !initialLng) {
      const autoGeocode = async () => {
        const result = await geocode(initialAddress);
        if (result) {
          setMarkerPos([result.lat, result.lng]);
          // Zoom to maximum level when in readOnly mode
          if (mapRef.current) {
            mapRef.current.setView([result.lat, result.lng], 18); // Maximum zoom level
          }
        }
      };
      autoGeocode();
    }
  }, [readOnly, initialAddress, initialLat, initialLng]);

  // Zoom to maximum level when in readOnly mode with coordinates
  useEffect(() => {
    if (readOnly && initialLat && initialLng && mapRef.current) {
      mapRef.current.setView([initialLat, initialLng], 18); // Maximum zoom level
    }
  }, [readOnly, initialLat, initialLng]);

  const center = useMemo<LatLngExpression>(() => {
    if (initialLat && initialLng) return [initialLat, initialLng];
    return vietnamCenter;
  }, [initialLat, initialLng]);

  const handlePick = useCallback(async (lat: number, lng: number, address?: string) => {
    const addr = address || (await reverseGeocode(lat, lng));
    setMarkerPos([lat, lng]);
    console.log('Location picked:', { lat, lng, addr });
    onLocationSelect(addr, lat, lng);
  }, [onLocationSelect]);

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    setIsSearching(true);
    const result = await geocode(searchInput.trim());
    setIsSearching(false);
    if (result && mapRef.current) {
      const { lat, lng, address } = result;
      mapRef.current.setView([lat, lng], 15);
      handlePick(lat, lng, address);
    }
  }, [searchInput, handlePick]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input - Only show when not readOnly */}
      {!readOnly && (
        <div className="space-y-2">
          <Label className="text-secondaryTextV1">Tìm kiếm vị trí</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập địa chỉ để tìm kiếm..."
                className="pl-10 border-lightBorderV1"
              />
            </div>
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !searchInput.trim()}
              className="px-4"
            >
              {isSearching ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconSearch className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="space-y-2">
        <Label className="text-secondaryTextV1">
          {readOnly ? "Vị trí trên bản đồ" : "Chọn vị trí trên bản đồ"}
        </Label>
        <div className="relative">
          <MapContainer
            whenReady={() => { /* assigned in ref callback below */ }}
            center={center}
            zoom={readOnly ? (initialLat && initialLng ? 18 : 6) : (initialLat && initialLng ? 15 : 6)}
            className="w-full h-96 border border-lightBorderV1 rounded-lg overflow-hidden"
            style={{ minHeight: '384px' }}
            ref={(instance) => { if (instance) { mapRef.current = instance; } }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!readOnly && <LeafletEvents onPick={(lat, lng, address) => handlePick(lat, lng, address)} />}
            {markerPos && (
              <Marker
                position={markerPos}
                draggable={!readOnly}
                eventHandlers={readOnly ? {} : {
                  dragend: async (e) => {
                    const m = e.target as L.Marker;
                    const pos = m.getLatLng();
                    const addr = await reverseGeocode(pos.lat, pos.lng);
                    handlePick(pos.lat, pos.lng, addr);
                  }
                }}
              />
            )}
          </MapContainer>
          {!readOnly && (
            <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md border border-lightBorderV1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconMapPin className="h-4 w-4" />
                <span>Click hoặc kéo marker để chọn vị trí</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GoogleMapLocationPicker: React.FC<GoogleMapLocationPickerProps> = ({
  onLocationSelect,
  initialAddress,
  initialLat,
  initialLng,
  className = '',
  readOnly = false,
}) => {
  const [searchInput, setSearchInput] = useState(initialAddress || '');

  return (
    <div className={`space-y-4 ${className}`}>
      <MapComponent
        onLocationSelect={onLocationSelect}
        initialAddress={initialAddress}
        initialLat={initialLat}
        initialLng={initialLng}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        readOnly={readOnly}
      />
    </div>
  );
};

export default GoogleMapLocationPicker;
