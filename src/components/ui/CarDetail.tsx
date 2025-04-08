'use client';

interface Car {
    Name: string;
    Model: string;
    Image: string;
    Price: number;
    Location: string;
    Similarity?: number;
}

interface CarDetailProps {
    mainCar: Car;
    recommendedCars?: Car[];
    onClose?: () => void;
    showActions?: boolean;
}

export default function CarDetail({
    mainCar,
    recommendedCars = [],
    onClose,
    showActions = true
}: CarDetailProps) {
    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    return (
        <div className="flex flex-col bg-white border rounded-lg shadow-md overflow-hidden max-w-md">
            <div className="p-3 bg-yellow-100 flex justify-between items-center">
                <h3 className="text-base font-semibold">{mainCar.Name} {mainCar.Model}</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-yellow-200 rounded-full"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="w-full h-48 overflow-hidden">
                <img
                    src={mainCar.Image}
                    alt={`${mainCar.Name} ${mainCar.Model}`}
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="p-3">
                <div className="grid gap-2">
                    <div className="bg-yellow-50 p-2 rounded-lg">
                        <div className="text-xs text-yellow-800">Marca</div>
                        <div className="font-medium text-sm">{mainCar.Name}</div>
                    </div>

                    <div className="bg-yellow-50 p-2 rounded-lg">
                        <div className="text-xs text-yellow-800">Modelo</div>
                        <div className="font-medium text-sm">{mainCar.Model}</div>
                    </div>

                    <div className="bg-yellow-50 p-2 rounded-lg">
                        <div className="text-xs text-yellow-800">Preço</div>
                        <div className="font-bold text-base text-yellow-600">{formatPrice(mainCar.Price)}</div>
                    </div>

                    <div className="bg-yellow-50 p-2 rounded-lg">
                        <div className="text-xs text-yellow-800">Localização</div>
                        <div className="font-medium text-sm">{mainCar.Location}</div>
                    </div>
                </div>
            </div>

            {recommendedCars.length > 0 && (
                <div className="p-3 border-t">
                    <h4 className="text-xs font-semibold mb-2">Recomendações similares:</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {recommendedCars.map((car, index) => (
                            <div
                                key={index}
                                className="flex border rounded-lg overflow-hidden bg-gray-50"
                            >
                                <div className="w-16 h-16 flex-shrink-0">
                                    <img
                                        src={car.Image}
                                        alt={`${car.Name} ${car.Model}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-1 flex-1">
                                    <div className="text-xs font-medium">{car.Name} {car.Model}</div>
                                    <div className="text-yellow-600 text-xs">{formatPrice(car.Price)}</div>
                                    <div className="text-xs text-gray-600">{car.Location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showActions && (
                <div className="p-3 border-t">
                    <div className="grid grid-cols-2 gap-2">
                        <button className="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                            Test drive
                        </button>
                        <button className="px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                            Contato
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}