import { useEffect, useState } from "react";
import axios from "axios";
import Events from "./Events";
import EventDetail from "./EventDetail";

export default function Search({ favorites, setFavorites }: any) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [keyword, setKeyword] = useState('');

    const [distance, setDistance] = useState(10);

    const [category, setCategory] = useState('Default');
    const categories: Record<string, string> = {
        'Default': '', 'Music': 'KZFzniwnSyZfZ7v7nJ',
        'Sports': 'KZFzniwnSyZfZ7v7nE',
        'Arts & Theatre': 'KZFzniwnSyZfZ7v7na',
        'Film': 'KZFzniwnSyZfZ7v7nn',
        'Miscellaneous': 'KZFzniwnSyZfZ7v7n1'
    };

    const [autoDetect, setAutoDetect] = useState(false);
    const [location, setLocation] = useState('');

    const [events, setEvents] = useState([]);
    const [showEvents, setShowEvents] = useState(false);
    
    const [showDetailedEvent, setDetailedEvent] = useState(false);

    const [eventId, setEventId] = useState('');

    function handleClear() {
        setShowSuggestions(false);
        setSuggestions([]);
        setKeyword('');
        setDistance(10);
        setCategory('Default');
        setAutoDetect(false);
        setLocation('');
        setShowEvents(false);
        setDetailedEvent(false);
        setEvents([]);
    }
    async function getSuggestions() {
        try {
            if (keyword == '') return;
            const response = await axios.get('/api/suggest', { params: { keyword: keyword } });
            // console.log(response.data);
            setSuggestions(response.data._embedded.attractions.map((obj: { name: string }) => obj.name));
        }
        catch {
        }

    }
    useEffect(() => { getSuggestions() }, [keyword]);

    async function getEvents(lat: string, long: string) {
        try {
            const response = await axios.get("/api/search", {
                params: {
                    'latitude': lat,
                    'longitude': long,
                    'keyword': keyword,
                    'segmentId': categories[category],
                    'radius': distance
                }
            });
            // console.log(response);
            response.data.page.totalElements > 0 ? setEvents(response.data._embedded.events) : setEvents([]);
            setShowEvents(true);
        }
        catch { }
    }

    async function getCoords() {
        try {
            if (autoDetect) {
                const response = await axios.get("https://ipinfo.io/json", { params: { token: process.env.REACT_APP_ipinfoToken } });
                // console.log(response);
                const [lat, long] = await response.data.loc.split(',');
                getEvents(lat, long);
            }
            else {
                const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", { params: { key: process.env.REACT_APP_googleKey, address: location } });
                // console.log(response);
                const loc: { lat: string, lng: string } = response.data.results[0].geometry.location;
                getEvents(loc['lat'], loc['lng']);
            }
        }
        catch { }
    }

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setShowEvents(false);
        setDetailedEvent(false);
        getCoords();
    }

    function showEventDetails(event: any) {
        console.log(event);
        setShowEvents(false);
        setEventId(event.id);
        setDetailedEvent(true);
    }

    function hideEventDetails() {
        setDetailedEvent(false);
        setShowEvents(true);
    }

    function formKeyword() {
        return (
            <>
                <p className="text-blue-300 text-sm after:content-['*'] after:ml-0.5 after:text-red-500">Keyword</p>

                <input required value={keyword}
                    onChange={(event) => { setKeyword(event.target.value); }}
                    className="rounded-md mt-1 w-full py-1 px-2"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                />
            </>
        )
    }

    function formSuggestions() {
        return (
            <>
                {
                    showSuggestions
                    &&
                    <div className="w-[86.5%] h-fit bg-white absolute rounded-md ">
                        {
                            suggestions.map((value) =>
                                <div
                                    className="w-full text-center py-2 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => { setKeyword(value); setShowSuggestions(false); }}
                                    onMouseDown={(event) => event.preventDefault()}>
                                    {value}
                                </div>)
                        }
                    </div>
                }
            </>
        )
    }

    function formDistance() {
        return (
            <>
                <div className="w-2/5">
                    <p className="text-blue-300 text-sm">Distance (miles)</p>
                    <input
                        className="rounded-md mt-1 w-full py-1 px-2"
                        type="number"
                        value={distance}
                        onChange={(event) => setDistance(JSON.parse(event.target.value))}
                    />
                </div>
            </>
        )
    }

    function formCategory() {
        return (
            <>
                <div className="w-2/5">
                    <p
                        className="text-blue-300 text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                        Category
                    </p>
                    <select
                        className="rounded-md mt-1 w-full py-1 px-2"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}>
                        {
                            Object.keys(categories).map(
                                (value) =>
                                    <option value={value}>{value}</option>
                            )
                        }
                    </select>
                </div>
            </>
        )
    }

    function formLocation() {
        return (
            <>
                <p
                    className="text-blue-300 text-sm after:content-['*'] after:ml-0.5 after:text-red-500 mt-2">
                    Location
                </p>

                <input
                    value={location}
                    className="rounded-md mt-1 w-full py-1 px-2"
                    disabled={autoDetect}
                    required={!autoDetect}
                    onChange={(event) => setLocation(event.target.value)}
                />
            </>
        )
    }

    function formAutoDetect() {
        return (
            <>
                <label className="flex items-center mt-1 text-blue-300 text-sm cursor-pointer">
                    <input
                        className="mr-2"
                        type="checkbox"
                        checked={autoDetect}
                        onChange={(event) => setAutoDetect(event.target.checked)}
                    />
                    Auto-detect your location
                </label>
            </>
        )
    }

    function formButtons() {
        return (
            <>
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        type="submit"
                        className="bg-red-600 px-2 py-1 rounded-md text-white text-sm">
                        SUBMIT
                    </button>

                    <button
                        type="button"
                        className="bg-blue-600 px-2 py-1 rounded-md text-white text-sm"
                        onClick={handleClear}>
                        CLEAR
                    </button>
                </div>
            </>
        )
    }

    return (
        <div className="absolute top-1/4 left-0 right-0">

            <form onSubmit={handleSubmit} className="md:w-[35%] h-fit p-8 backdrop-blur-sm bg-[rgb(255,255,255,0.15)] mx-auto rounded-2xl">

                <p className="text-white text-3xl font-serif mx-auto w-fit ">
                    Events Search
                </p>

                <hr className="mx-auto my-2" />

                {formKeyword()}
                {formSuggestions()}

                <div className="flex space-x-8 mt-2">
                    {formDistance()}
                    {formCategory()}
                </div>

                {formLocation()}
                {formAutoDetect()}

                {formButtons()}

            </form>

            {
                showEvents
                &&
                <Events events={events} showEventDetails={showEventDetails} />
            }

            {
                showDetailedEvent
                &&
                <EventDetail id={eventId} back={hideEventDetails} favorites={favorites} setFavorites={setFavorites} />
            }
        </div>

    );
}