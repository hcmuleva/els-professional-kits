"use client"

import  React from "react"
import { Card, Avatar, Button, Space, Grid } from "antd-mobile"
import styles from "./usercard.css"
import AssignUserRoleToCommunity from "./AssignUserRoleToCommunity"


const UserCard = ({
    userdata,
    templeId,
  communityId,
  name = "Danny McLoan",
  title = "Senior Journalist",
  avatar = "/placeholder.svg?height=100&width=100",
  stats = {
    articles: 41,
    followers: 976,
    rating: 8.5,
  },
  onChat = () => console.log("Chat clicked"),
  onFollow = () => console.log("Follow clicked"),
}) => {
  const thumbnail = userdata?.attributes?.profilePicture?.data?.attributes?.formats?.thumbnail?.url
  console.log("templeId,communityId,",templeId,communityId)
  const [isAssignedRole, setIsAssignedRole] = React.useState(false)
  
  return (
    <div className={styles.cardWrapper}>
    {isAssignedRole&&(
        <AssignUserRoleToCommunity 
          userdata={userdata} 
          templeId={templeId} 
          communityId={communityId}
          setIsAssignedRole={setIsAssignedRole}
          onClose={() => setIsAssignedRole(false)}
        />
      )}
      {!isAssignedRole &&
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.avatarSection}>
            <Avatar src={thumbnail} className={styles.avatar} />
          </div>
          <div className={styles.infoSection}>
            <h2 className={styles.name}>{userdata?.attributes?.first_name}:{userdata?.id}</h2>
            <p className={styles.title}>{title}</p>
            <div className={styles.statsContainer}>
              <Grid columns={3} gap={8}>
                <Grid.Item>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>{stats.articles}</div>
                    <div className={styles.statLabel}>Articles</div>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>{stats.followers}</div>
                    <div className={styles.statLabel}>Followers</div>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>{stats.rating}</div>
                    <div className={styles.statLabel}>Rating</div>
                  </div>
                </Grid.Item>
              </Grid>
            </div>

            <Space className={styles.buttonContainer}>
              <Button className={styles.chatButton} onClick={()=>setIsAssignedRole(true)}>
                AssignRole
              </Button>
              <Button className={styles.followButton} color="primary" onClick={onFollow}>
                FOLLOW
              </Button>
            </Space>
          </div>
        </div>
      </Card>}
      <br />
    </div>
  )
}

export default UserCard
