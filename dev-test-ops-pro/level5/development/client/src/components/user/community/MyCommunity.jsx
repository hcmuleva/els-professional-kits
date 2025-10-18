import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { getMyCommunities } from '../../../services/community';
import CommunityCard from './CommunityCard';

export default function MyCommunity() {
    const { user } = useContext(AuthContext);
    const [communityList, setCommunityList] = useState([]);

    useEffect(() => {
        const fetchMyCommunities = async () => {
            try {
                const response = await getMyCommunities(user.id); // API call
                console.log("response", response);
                setCommunityList(response?.data || []);
            } catch (error) {
                console.error('Error fetching community:', error);
            }
        };

        if (user?.id) {
            fetchMyCommunities();
        }
    }, [user.id]);

    return (
        <div>
            {communityList.map((community, index) => {
                const communityData = community?.attributes?.community?.data?.attributes;
                const communityRole = community?.attributes?.communityrole?.data?.attributes;
                const temple = community?.attributes?.temple?.data?.attributes;
                console.log("communityRole", communityRole);
                if (!communityData) return null;

                return (
                    <CommunityCard
                        key={index}
                        communityData={communityData}
                        communityRole={communityRole}
                        temple={temple}
                    />
                );
            })}
        </div>
    );
}
