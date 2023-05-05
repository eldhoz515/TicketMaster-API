import { NavLink } from 'react-router-dom';

export default function Nav() {
    return (
        <>
            <div className='ml-auto w-fit flex space-x-4 m-4 items-center'>
                <NavLink
                    className={(x) =>
                        `border-2 px-2 py-0.5 rounded-xl 
                        ${x.isActive ?
                            'border-gray-400' :
                            'border-transparent'} text-white`}
                    to='/search'>
                    Search
                </NavLink>
                <NavLink
                    className={(x) =>
                        `border-2 px-2 py-0.5 rounded-xl 
                 ${x.isActive ?
                            'border-gray-400' :
                            'border-transparent'} text-white`}
                    to='/favorites'>
                    Favorites
                </NavLink>
            </div>
        </>
    );
}