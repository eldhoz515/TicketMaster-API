import { useEffect } from "react"

export default function AboutEvent({ event }: any) {

    const attributes: any = {
        'Date / Time': () => `${event.dates?.start?.localDate ?? ''} ${event.dates?.start?.localTime ?? ''}`,

        'Artish/Team': () =>
            event._embedded?.attractions?.map(
                (team: any) => [team?.name ?? '', team?.url ?? '']
            ).filter(
                ([name, url]: any) => name && url
            ),

        'Venue': () => event._embedded?.venues?.[0]?.name ?? '',

        'Genres': (obj: any = event.classifications?.[0] ?? '') =>
            ['segment', 'genre', 'subGenre', 'type', 'subType'].map(
                (value) => obj[value]?.name
            ).filter(
                (value) => value != 'Undefined'
            ).join(' | '),

        'Price Ranges': (obj: any = event.priceRanges?.[0] ?? '') =>
            obj.min ? `${obj.min ?? ''} - ${obj.max ?? ''} ${obj.currency ?? ''}` : '',

        'Ticket Status': () => event.dates?.status?.code ?? '',

        'Buy Ticket At': () => event.url ?? '',
    }

    function getAttribute(key: string) {
        switch (key) {

            case 'Buy Ticket At':
                return <a
                    className="underline text-[#8bdaff]"
                    target="_blank"
                    href={attributes[key]()}>
                    TicketMaster
                </a>

            case 'Ticket Status':
                const status = attributes[key]();

                const statusColor: any = {
                    'onsale': 'bg-green-700',
                    'offsale': 'bg-red-700',
                    'canceled': 'bg-black',
                    'postponed': 'bg-orange-700',
                    'rescheduled': 'bg-orange-700'
                }

                return <div
                    className={`${statusColor[status] ?? 'bg-black'} 
                px-2 py-1 rounded-md`}>
                    {status.toUpperCase()}
                </div>

            case 'Artish/Team':
                const teams: any = attributes[key]();
                // console.log(teams)
                return <>
                    {
                        teams.map(
                            ([name, url]: any, i: number) =>
                                name && url
                                &&
                                <span className="text-blue-200">
                                    {i ? ' | ' : ''}
                                    <a href={url} target="_blank">
                                        {name}
                                    </a>
                                </span>
                        )
                    }
                </>

            default:
                return attributes[key]()
        }
    }

    function showAttributes() {
        return (
            <>
                <div className="flex flex-col grow items-center">
                    {Object.keys(attributes).map(
                        (key) =>
                            attributes[key]()
                            &&
                            <>
                                <p className="font-medium mb-1 text-sm">
                                    {key}
                                </p>
                                <p className="text-xs mb-3">
                                    {getAttribute(key)}
                                </p>
                            </>
                    )}
                </div>
            </>
        )
    }

    function showShare() {
        return (
            <>
                <span className="text-sm">
                    Share on :
                </span>

                <a
                    href={`https://twitter.com/intent/tweet?url=${event?.url}&text=Check out ${event.name} on TicketMaster`}
                    target="_blank">
                    <svg width="20" height="20">
                        <image
                            href="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" width="20"
                            height="20"
                        />
                    </svg>
                </a>
                
                <a
                    href={`https://www.facebook.com/sharer.php?u=${event?.url}`}
                    target="_blank">
                    <svg width="20" height="20">
                        <image
                            href="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                            width="20"
                            height="20"
                        />
                    </svg>
                </a>
            </>
        )
    }

    return (
        <>
            <div className="w-full h-fit p-10 flex items-center space-x-4">
                {showAttributes()}
                <img
                    className="w-1/2 rounded-3xl"
                    src={event.seatmap?.staticUrl ?? ''}
                />
            </div>

            <div className="flex items-center justify-center space-x-2">
                {showShare()}
            </div>
        </>
    )
}