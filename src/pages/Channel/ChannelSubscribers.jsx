import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChannelSubscribers } from "../../store/Slices/subscriptionSlice";
import { Avatar, Button } from "../../components";
import { Link } from "react-router-dom";
import { toggleSubscription } from "../../store/Slices/subscriptionSlice";
function ChannelSubscribers() {
    const dispatch = useDispatch();
    const channelId = useSelector((state) => state.user.profileData?._id);
    const subscribers = useSelector(
        (state) => state.subscription.channelSubscribers
    );
    console.log(subscribers);
    useEffect(() => {
        if (channelId) {
            dispatch(getUserChannelSubscribers(channelId));
        }
    }, [dispatch, channelId]);
    const handleToogle = async (subscriberId) => {
        await dispatch(toggleSubscription(subscriberId)); // Toggle subscription
        dispatch(getUserChannelSubscribers(channelId)); // Fetch updated subscribers list
    };
    return (
        <>
            {subscribers?.map((subscriber) => (
                <Link
                    key={subscriber?.subscriberDetails?._id}
                    className="flex border-b border-slate-500 px-3 py-1 justify-between items-center text-white"
                >
                    <div className="flex gap-3 items-center">
                        <Avatar
                            src={subscriber?.subscriberDetails?.avtar}
                            channelName={subscriber?.subscriberDetails?.username}
                        />
                        <div>
                            <h5 className="text-sm">
                                {subscriber?.subscriberDetails?.username}
                            </h5>
                            <span className="text-xs text-slate-400">
                                {subscriber?.subscriberDetails?.totalSubscribers}{" "}
                                Subscribers
                            </span>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-purple-500 text-black text-xs py-1 px-2" onClick={()=>{handleToogle(subscriber?.subscriberDetails?._id)}}>
                            {subscriber?.subscriberDetails?.subscribedTOsubscriber
                                ? "Subscribed"
                                : "subscribe"}
                        </Button>
                    </div>
                </Link>
            ))}
        </>
    );
}

export default ChannelSubscribers;
