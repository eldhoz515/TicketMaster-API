import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export function Map({ closeMap, center }: any) {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_googleKey!
    });

    return (
        <>
            <div className="fixed w-screen h-screen bg-[rgb(0,0,0,0.5)] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid place-items-center">
                
                <div className="w-1/3 h-5/6 bg-white rounded-md flex flex-col">

                    <p className="text-black font-bold text-xl mx-2 my-2">
                        Event Venue
                    </p>

                    <hr className='mb-4' />

                    {
                        isLoaded
                        &&
                        <div
                            className='w-11/12 mx-auto grow rounded-xl overflow-hidden'>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                center={center}
                                zoom={10}
                            >
                                <Marker position={center} />
                            </GoogleMap>
                        </div>
                    }

                    <button
                        className='bg-black px-2 py-1 rounded-md m-5 w-fit'
                        onClick={closeMap}>
                        Close
                    </button>

                </div>
            </div>
        </>
    )
}