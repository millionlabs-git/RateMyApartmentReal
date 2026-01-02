import { MapPin, Building2, User, Map } from "lucide-react";

interface BuildingInfoProps {
  name: string;
  address: string;
  city: string;
  zip: string;
  landlord: string | null;
  neighborhood: string | null;
  buildingType: string | null;
}

export function BuildingInfo({
  name,
  address,
  city,
  zip,
  landlord,
  neighborhood,
  buildingType,
}: BuildingInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#1C1917] dark:text-white mb-2">
          {name}
        </h1>
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-lg">{address}</p>
            <p>{city}, NY {zip}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {landlord && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Landlord</p>
              <p className="font-medium text-[#1C1917] dark:text-white">{landlord}</p>
            </div>
          </div>
        )}

        {neighborhood && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Map className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Neighborhood</p>
              <p className="font-medium text-[#1C1917] dark:text-white">{neighborhood}</p>
            </div>
          </div>
        )}

        {buildingType && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Building2 className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Building Type</p>
              <p className="font-medium text-[#1C1917] dark:text-white">{buildingType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
