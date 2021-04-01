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
  return (
    <div>
      {' '}
      <h6 className="m-1">Spread the Word!</h6>
      <div>
        <FacebookShareButton url={props.url} quote="Check out this award!">
          <FacebookIcon className="rounded m-1" size="2.5rem" />
        </FacebookShareButton>
        <TwitterShareButton url={props.url} quote="Check out this award!">
          <TwitterIcon className="rounded m-1" size="2.5rem" />
        </TwitterShareButton>
        <LinkedinShareButton url={props.url} quote="Check out this award!">
          <LinkedinIcon className="rounded m-1" size="2.5rem" />
        </LinkedinShareButton>
        <WhatsappShareButton url={props.url} quote="Check out this award!">
          <WhatsappIcon className="rounded m-1" size="2.5rem" />
        </WhatsappShareButton>
        <RedditShareButton url={props.url} quote="Check out this award!">
          <RedditIcon className="rounded m-1" size="2.5rem" />
        </RedditShareButton>
      </div>
    </div>
  )
}
