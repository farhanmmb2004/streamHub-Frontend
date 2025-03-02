import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribedChannels } from "../store/Slices/subscriptionSlice";
import { Link } from "react-router-dom";
import { VideoList, Avatar } from "../components";

function MySubscriptions() {
    const dispatch = useDispatch();
    const subscriptions = useSelector(
        (state) => state.subscription?.mySubscriptions
    );
    const subscriberId = useSelector((state) => state.auth?.userData?._id);
    useEffect(() => {
        if (subscriptions) {
            dispatch(getSubscribedChannels(subscriberId));
        }
    }, [dispatch, subscriberId]);
    window.scrollTo(0, 0);
    // console.log(subscriptions);
    return (
        <>
            <div className="flex gap-2 p-2 text-white items-center bg-[#222222]">
                {subscriptions?.map((subscription) => (
                    <div
                        key={subscription?.channelDetails?._id}
                        className="flex flex-col items-center overflow-x-scroll"
                    >
                        <Avatar
                            src={subscription?.channelDetails?.avtar}
                            channelName={
                                subscription?.channelDetails?.username
                            }
                        />
                        <h5 className="text-xs">
                            {subscription?.channelDetails?.username}
                        </h5>
                    </div>
                ))}
            </div>

            <div className="text-white mb-20 sm:mb-0 w-full grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 overflow-y-scroll">
                {subscriptions?.map((subscription) => (
                    <Link
                        to={`/watch/${subscription?.channelDetails?.latestvidio?._id}`}
                        key={subscription?.channelDetails?.latestvidio?._id}>
                        {subscription?.channelDetails?.latestvidio && (
                            <VideoList
                                key={subscription?.channelDetails?._id}
                                avatar={
                                    subscription?.channelDetails?.avtar
                                }
                                duration={
                                    subscription?.channelDetails?.latestvidio?.duration
                                }
                                title={
                                    subscription?.channelDetails?.latestvidio?.title
                                }
                                thumbnail={
                                    subscription?.channelDetails?.latestvidio?.thumbnail
                                }
                                createdAt={
                                    subscription?.channelDetails?.latestvidio?.createdAt
                                }
                                views={
                                    subscription?.channelDetails?.latestvidio?.views
                                }
                                channelName={
                                    subscription?.channelDetails?.username
                                }
                                videoId={
                                    subscription?.channelDetails?.latestvidio?._id
                                }
                            />
                        )}
                    </Link>
                ))}
            </div>
        </>
    );
}

export default MySubscriptions;
