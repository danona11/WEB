import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './ReduxStore';

//the usedispath and useSelector that redux contains are generic - type script no likey:
//this component implements them so they know the rootState - the state of the entire app (i think)
//                                        and the AppDispatch - the types used in action to dispatch (i think)

export const useAppDispatch = () => useDispatch<AppDispatch>()


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector