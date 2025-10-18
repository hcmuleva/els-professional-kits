import React from "react"
import { Button, Dropdown } from "antd"
import { ShareAltOutlined, WhatsAppOutlined, CopyOutlined } from "@ant-design/icons"
import { Share } from "@capacitor/share"
import { Capacitor } from "@capacitor/core"


const ShareIcon = ({ title, description, url, onShare }) => {
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${title}\n\n${description}\n\n${url}`)
    const whatsappUrl = `https://wa.me/?text=${text}`

    if (Capacitor.isNativePlatform()) {
      window.open(whatsappUrl, "_system")
    } else {
      window.open(whatsappUrl, "_blank")
    }
    onShare?.("whatsapp")
  }

  const handleNativeShare = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: title,
          text: `${title}\n\n${description}`,
          url: url,
          dialogTitle: "Share with friends",
        })
      } else {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: `${title}\n\n${description}`,
            url: url,
          })
        }
      }
      onShare?.("native")
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      onShare?.("copy")
    } catch (error) {
      console.error("Error copying:", error)
    }
  }

  const items = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppOutlined style={{ color: "#25d366" }} />,
      onClick: handleWhatsAppShare,
    },
    {
      key: "native",
      label: "Share",
      icon: <ShareAltOutlined />,
      onClick: handleNativeShare,
    },
    {
      key: "copy",
      label: "Copy Link",
      icon: <CopyOutlined />,
      onClick: handleCopyLink,
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <Button type="text" icon={<ShareAltOutlined />} size="large" style={{ color: "#666" }} />
    </Dropdown>
  )
}

export default ShareIcon
