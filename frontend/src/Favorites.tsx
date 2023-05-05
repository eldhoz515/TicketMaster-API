export default function Favorites({ favorites, setFavorites }: any) {

    const attributes: any = {
        'Date/Time': (event: any) =>
            `${event.dates?.start?.localDate ?? ''} ${event.dates?.start?.localTime ?? ''}`,

        'Event': (event: any) => event.name,

        'Category': (event: any) =>
            ['segment', 'genre', 'subGenre', 'type', 'subType'].map(
                (value) => event.classifications[0][value]?.name
            ).filter((value) => value != 'Undefined'
            ).join(' | '),

        'Venue': (event: any) => event._embedded?.venues[0]?.name ?? '',
    }

    function tableHead() {
        return (
            <>
                <thead>
                    <tr className="border-b-2">
                        <th className="">
                            #
                        </th>
                        {Object.keys(attributes).map((column) =>
                            <th className="">
                                {column}
                            </th>
                        )}
                        <th>Favorite</th>
                    </tr>
                </thead>
            </>
        )
    }

    function tableBody() {
        return (
            <>
                <tbody className="text-xs">
                    {Object.keys(favorites).map(
                        (eventName: string, i: number) =>
                            <tr className="border-b-2">
                                <td className="font-bold">
                                    {i + 1}
                                </td>
                                {Object.keys(attributes).map(
                                    (column) =>
                                        <td className="">
                                            {attributes[column](favorites[eventName])}
                                        </td>
                                )}
                                <td className="">
                                    <div
                                        className="bg-[url(delete.png)] bg-cover w-5 h-5 cursor-pointer active:scale-110 mx-auto"
                                        onClick={() => setFavorites(favorites[eventName], 'remove')} />
                                </td>
                            </tr>
                    )}
                </tbody>
            </>
        )
    }

    return (
        <>
            {
                Object.keys(favorites).length > 0 ?
                    <>
                        <p className="mt-10 mb-5 text-white font-medium mx-auto w-fit">
                            List of your favorite events
                        </p>
                        <table className="bg-white mx-auto w-1/2 text-center rounded-lg overflow-hidden">
                            {tableHead()}
                            {tableBody()}
                        </table>
                    </> :
                    <>
                        <div className="mx-auto bg-white text-red-700 font-bold md:w-1/2 text-center text-xl mt-20 rounded-full">
                            No favorite events to show
                        </div>
                    </>
            }
        </>
    )
}