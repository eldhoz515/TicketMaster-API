import { useEffect, useState } from "react";

export default function Events({ events, showEventDetails }: any) {
    
    const [order, setOrder] = useState('asc');
    const [column, setColumn] = useState('Date/Time');
    const [sortedEvents, setSortedEvents] = useState(events);

    const criteria: any = {
        'Date/Time':
            (event: any) =>
                `${event.dates?.start?.localDate ?? ''} ${event.dates?.start?.localTime ?? ''}`,

        'Icon': (event: any) => event.images?.[0]?.url ?? '',

        'Event': (event: any) => event.name,

        'Genre': (event: any) => event.classifications?.[0]?.segment?.name ?? '',

        'Venue': (event: any) => event._embedded?.venues?.[0]?.name ?? '',
    };

    function sortEvents(a: any, b: any) {
        const result = criteria[column](a).toLowerCase() < criteria[column](b).toLowerCase() ? -1 : 1;
        return order == 'asc' ? result : -result;
    }

    useEffect(() => {
        let temp = [...events];
        setSortedEvents(temp.sort(sortEvents));
    }, [events, order, column]);

    function tableHead() {
        return (
            <>
                <thead className="">
                    <tr className="">
                        {Object.keys(criteria).map(
                            (heading) =>
                                <th
                                    className=
                                    {`min-w-max select-none py-2 text-sm font-medium 
                                ${column == heading ? "bg-[#1b1b22]" : 'bg-[#22222a]'} 
                                 ${heading != 'Icon' && 'cursor-pointer'}`}

                                    onClick={() => {
                                        if (heading != 'Icon') {
                                            setOrder(column == heading ? (order == 'desc' ? 'asc' : 'desc') : 'asc'); setColumn(heading);
                                        }
                                    }}>

                                    {heading}{column == heading && (order == 'asc' ? ' ▲' : ' ▼')}

                                </th>
                        )}
                    </tr>
                </thead>
            </>
        )
    }

    function tableBody() {
        return (
            <>
                <tbody className="text-sm text-center">
                    {
                        sortedEvents.map(
                            (event: any, i: number) =>
                                <tr
                                    className={`${i % 2 != 0 && 'bg-[#1b1b22]'} cursor-pointer`}
                                    onClick={() => showEventDetails(event)}>
                                    <td className="w-1/5 py-6">
                                        {criteria['Date/Time'](event)}
                                    </td>
                                    <td className="h-16 w-20 p-2">
                                        <img
                                            className="w-full h-full rounded-md"
                                            src={criteria['Icon'](event)}
                                        />
                                    </td>
                                    {
                                        ['Event', 'Genre', 'Venue'].map(
                                            (column) =>
                                                <td>
                                                    {criteria[column](event)}
                                                </td>
                                        )
                                    }
                                </tr>)
                    }
                </tbody>
            </>
        )
    }
    return (
        <>
            {
                events.length > 0 ?
                    <table className="text-white bg-[#292a2f] w-1/2 mx-auto my-20 ">
                        {tableHead()}
                        {tableBody()}
                    </table>
                    :
                    <div className="mx-auto bg-white text-red-700 font-bold w-1/2 text-center text-xl mt-20 rounded-full">
                        No results available
                    </div>
            }
        </>
    );
}