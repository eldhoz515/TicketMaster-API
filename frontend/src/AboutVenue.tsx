import { useState } from "react";
import { Map } from "./Map";

export default function AboutVenue({ venue }: any) {

    const longAttributes = ['Open Hours', 'General Rule', 'Child Rule'];
    const length = 100;

    const [expandable, setExpandable] =
        useState(longAttributes.reduce(
            (obj: any, attribute: any) => {
                const value = getAttribute(attribute);
                return {
                    ...obj, [attribute]:
                        { long: value && value.length > length, value: value, showMore: false }
                };
            }, {}))

    const [map, setMap] = useState(false);

    function getAttribute(key: string) {
        switch (key) {

            case 'Name':
                return venue?.name;

            case 'Address':
                return [venue.address?.line1 ?? '', venue.city?.name ?? '', venue.state?.name ?? ''
                ].filter((value) => value != '').join(', ') ?? '';

            case 'Phone Number':
                return venue.boxOfficeInfo?.phoneNumberDetail ?? '';

            case 'Open Hours':
                return venue.boxOfficeInfo?.openHoursDetail ?? '';

            case 'General Rule':
                return venue.generalInfo?.generalRule ?? '';

            case 'Child Rule':
                return venue.generalInfo?.childRule ?? '';
        }
    }

    function showShortAttributes() {
        return (
            <>
                <div className="w-1/2 text-center">
                    {
                        ['Name', 'Address', 'Phone Number'
                        ].map((key) =>
                            getAttribute(key) &&
                            <>
                                <p className="text-md font-medium">
                                    {key}
                                </p>
                                <p className="text-xs mb-4">
                                    {getAttribute(key)}
                                </p>
                            </>
                        )
                    }
                </div>
            </>
        )
    }

    function showLongAttributes() {
        return (
            <>
                {
                    longAttributes.map((key) => {

                        expandable[key].value
                            &&
                            <>
                                <p className="text-md font-medium">
                                    {key}
                                </p>
                                <p
                                    className={`text-xs ${expandable[key].long ? 'mb-1' : 'mb-4'}`}>
                                    {expandable[key].long ?
                                        (expandable[key].showMore ? expandable[key].value :
                                            expandable[key].value.slice(0, length)) : expandable[key].value}
                                </p>
                                {
                                    expandable[key].long
                                    &&
                                    <p
                                        className={`font-thin text-xs text-blue-400 underline cursor-pointer 
                                    ${expandable[key].long && 'mb-4'}`}
                                        onClick={() =>
                                            setExpandable({
                                                ...expandable,
                                                [key]: { ...expandable[key], showMore: !expandable[key].showMore }
                                            })
                                        } >
                                        {
                                            expandable[key].showMore ?
                                                'Show Less ↑' :
                                                'Show More ↓'
                                        }
                                    </p >
                                }
                            </>
                    })
                }
            </>
        )
    }

    function showMap() {
        return (
            <>
                {
                    map
                    &&
                    venue?.location?.latitude
                    &&
                    <Map
                        closeMap={() => {
                            setMap(false); document.getElementById('container')!.style.overflow = 'auto';
                        }}
                        center={{ lat: JSON.parse(venue.location.latitude), lng: JSON.parse(venue.location.longitude) }}
                    />
                }
            </>
        )
    }

    return (
        <>
            <div className="w-full h-fit flex p-10 space-x-10">
                {showShortAttributes()}

                <div className="w-1/2 text-center">
                    {showLongAttributes()}
                </div>
            </div >

            <button
                className="text-white bg-red-600 px-3 py-1.5 mx-auto w-fit block rounded-md"
                onClick={() => {
                    setMap(true);
                    document.getElementById('container')!.style.overflow = 'hidden';
                }}>
                Show venue on Google Maps
            </button>

            {showMap()}
        </>
    )
}