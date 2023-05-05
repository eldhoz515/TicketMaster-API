import { useEffect, useState } from "react";
import axios from "axios";
import AboutEvent from "./AboutEvent";
import AboutVenue from "./AboutVenue";

export default function EventDetail({ id, back, favorites, setFavorites }: any) {

    const [event, setEvent]: any = useState(null);
    const [tab, setTab] = useState('Events');
    const favorite = event?.name in favorites;

    async function getDetails() {
        try {
            const response = await axios.get("/api/eventDetails", { params: { id: id } });
            // console.log(response);
            setEvent(response.data);
        }
        catch {

        }
    }
    useEffect(() => { getDetails() }, []);

    function header() {
        return (
            <>
                {
                    event
                    &&
                    <div className="flex items-center h-fit justify-center space-x-4 mt-4 mb-4">
                        <div className=" text-lg">
                            {event.name}
                        </div>

                        <div
                            className={
                                `w-8 h-8 ${favorite ? 'bg-[url(favorite.png)]' : 'bg-[url(unfavorite.png)]'} bg-contain bg-center bg-no-repeat cursor-pointer active:scale-90 hover:scale-110`
                            }
                            onClick={() => {
                                favorite ? setFavorites(event, 'remove') : setFavorites(event, 'add');
                            }} />

                    </div>
                }
            </>
        )
    }

    function tabs() {
        return (
            <>
                <div className="w-full bg-[#479485] flex justify-center text-md space-x-8">
                    {
                        ['Events', 'Venue'].map(
                            (tabValue) =>
                                <div
                                    className=
                                    {`cursor-pointer px-2 pb-1 pt-3 border-b-2 
                                    ${tab == tabValue ?
                                            'border-[rgb(255,255,255,0.3)]' :
                                            'border-transparent'}`}
                                    onClick={
                                        () => setTab(tabValue)
                                    }>
                                    {tabValue}
                                </div>
                        )
                    }
                </div>
            </>
        )
    }

    return (
        <>
            <div className="backdrop-blur-sm text-white bg-[rgb(255,255,255,0.15)] mx-auto my-20 h-fit md:w-1/2 rounded-md py-5">

                <div
                    className="before:content-['<'] before:mr-1 ml-5 hover:cursor-pointer"
                    onClick={() => { back() }}>
                    Back
                </div>

                {header()}

                {tabs()}

                {
                    event?._embedded?.venues?.[0] && (tab == 'Events' ?
                        <AboutEvent event={event} />
                        :
                        <AboutVenue venue={event?._embedded?.venues?.[0]} />)
                }
            </div>
        </>
    )
}