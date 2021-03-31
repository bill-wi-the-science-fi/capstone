import React from 'react'
import {
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  RedditIcon,
  RedditShareButton
} from 'react-share'

export const ShareButton = (props) => {
  console.log('props', props)
  return (
    <div>
      {' '}
      <h6>Spread the Word!</h6>
      <div>
        <FacebookShareButton url={props.url} quote="hi">
          <FacebookIcon size="2.5rem" />
        </FacebookShareButton>
        <TwitterShareButton url={props.url} quote="hi">
          <TwitterIcon size="2.5rem" />
        </TwitterShareButton>
        <LinkedinShareButton url={props.url} quote="hi">
          <LinkedinIcon size="2.5rem" />
        </LinkedinShareButton>
        <WhatsappShareButton url={props.url} quote="hi">
          <WhatsappIcon size="2.5rem" />
        </WhatsappShareButton>
        <RedditShareButton url={props.url} quote="hi">
          <RedditIcon size="2.5rem" />
        </RedditShareButton>
      </div>
    </div>
  )
}
