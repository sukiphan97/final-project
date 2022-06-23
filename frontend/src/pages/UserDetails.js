import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import styled from 'styled-components'
import moment from 'moment'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdOutlineFileDownloadDone } from 'react-icons/md'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { Loader } from "../components/Loader";
import { API_URL } from '../utils/url';

export const UserDetails = () => {
    const existingReviews = useSelector(store => store.user.reviews);

    const [review, setReview] = useState('');
    const [reviewList, setReviewList] = useState(existingReviews);
	const { userId } = useParams()
    const navigate = useNavigate()
    const accessToken = useSelector((store) => store.user.accessToken);
    const mainUserId = useSelector((store) => store.user.userData)
    
    const [edit, setEdit] = useState(false)
    const [editText, setEditText] = useState('')
    const [editId, setEditId] = useState('')
    const [loading, setLoading] = useState(false)

    // const userToShow = otherUsersData.find(user => user._id === userId)
    const [userToShow, setUserToShow] = useState([])


    const onFormSubmit = (e) => {
        e.preventDefault();
        
        const options = {
            method: "POST",
            headers: {
                        "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                    reviewerId: mainUserId._id, 
                    revieweeId: userId, 
                    username: mainUserId.username,
                    img: mainUserId.img,
                    reviewText: review
                    }),
        }

        fetch(API_URL('reviews'), options) 
        .then(res => res.json())
        .then(data => setReviewList((prev) => [...prev, data.response]))
        .catch(error => console.log(error))
        .finally(() => setReview(''))
    }    
    useEffect(() => {
        fetch(API_URL('reviews')) 
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const filterReviews = data.response.filter(item => item.revieweeId === userId)
                setReviewList(filterReviews)        
            }
        })
    }, [])

    const onEditClick = async (message, _id, reviewId) => {
        
        setEditId(reviewId)
        const findId = await reviewList.map(item => {
            if (item._id === reviewId && item.reviewerId === mainUserId._id) {
                setEdit(!edit)
                return {...item, reviewText: editText}
            } else {
                return item
            }
        })        
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                reviewId: reviewId, 
                reviewText: editText
            }),
          };

        fetch(API_URL('editReview'), options)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .finally(() => setEditText(''))

        return setReviewList(findId)
        }     
    
    const onDeleteReview = async (id, username) => {

        if (username === mainUserId.username) {
            
                    const updateReviews = await reviewList.filter(item => item._id !== id);
            
                    const options = {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ 
                            reviewId: id, 
                        }),
                    }
            
                    await fetch(API_URL('deleteReview'), options)
            
                    return setReviewList(updateReviews)
        }
    }

    useEffect(() => {
        const options = {
          method: 'GET',
          headers: {
              'Authorization': accessToken
          },
      }
        setLoading(true) 
        fetch(API_URL('users'), options)
        .then((res) => res.json())
        .then((data) => {
          const userNew = data.find(item => item._id === userId)  
          setUserToShow(userNew)
        })
        .finally(() => setLoading(false))
    
      }, [])


    return(
        <Main>
            {loading && <Loader />}
            {!loading && 
            <>
            <BackButton onClick={() => navigate(-1)}>Back</BackButton>
            {userToShow.length !== 0 && 
            <BigContainer>  
                <SmallContainer>      
                    <ImageContainer>
                        <Img src={userToShow.img}/>
                    </ImageContainer>
                    <TextContainer>
                        <ProfileTitle>@{userToShow.username}</ProfileTitle>
                        <ProfileText>
                            <ProfileTag>
                                <SpanBold>Profile type:</SpanBold> 
                                <SpanBold>Animal type:</SpanBold>  
                                <SpanBold>Location:</SpanBold>  
                                <SpanBold>Services:</SpanBold> 
                                <SpanBold>Dates:</SpanBold>  
                                <SpanBold>Description:</SpanBold> 
                            </ProfileTag>
                            <ProfileDetail>
                                <span>{userToShow.profileType}</span>
                                <span>{userToShow.animalType}</span>
                                <span>{userToShow.location}</span>
                                <span>{userToShow.preferableTime.map(time => {
                                return <span key={time}> {time}</span>})}
                                </span>
                                <span>{moment(userToShow.startDate).format('MMM Do YY')} - {moment(userToShow.endDate).format('MMM Do YY')}</span>
                                <span>{userToShow.description}</span>
                            </ProfileDetail>
                        </ProfileText> 
                        <SendEmail href={`mailto:${userToShow.email}`}>Contact {userToShow.username}</SendEmail>             
                        <div>
                            <ReviewContainer>
                                    {reviewList.length > 0 && reviewList.map(item => (
                                        <Reviews>
                                            <img src={item.img} alt="reviewer" />
                                            <div>
                                                <ReviewHead>
                                                    <Name>@{item.username}</Name>
                                                    <Buttons>
                                                        <EditBtn 
                                                            display={item.reviewerId === mainUserId._id ? 'inline-block' : 'none'} 
                                                            type='button' onClick={() => onEditClick(item.reviewText, item.reviewerId, item._id)}>
                                                                {!edit ? <AiOutlineEdit /> : <MdOutlineFileDownloadDone />}
                                                        </EditBtn>
                                                        <EditBtn display={item.reviewerId === mainUserId._id ? 'inline-block' : 'none'}  onClick={() => onDeleteReview(item._id, item.username)}><RiDeleteBin2Line/></EditBtn>
                                                    </Buttons>
                                                </ReviewHead>
                                                {item._id === editId && edit && <ReviewInput 
                                                                type='text'
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                value={editText}
                                                            />}
                                                <ReviewText display={item._id === editId && edit ? 'none' : 'block'}>
                                                "{item.reviewText}" 
                                                </ReviewText>
                                            </div>
                                        </Reviews>
                                    ))}
                            </ReviewContainer>
                        <Form onSubmit={onFormSubmit}>
                            <ReviewInput
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder='write review here 🐶' 
                                width = {review}
                            ></ReviewInput>
                            <SubmitBtn type='submit' display = {review}>Add</SubmitBtn>
                        </Form>
                        </div>
                    </TextContainer>
                </SmallContainer>
            </BigContainer>}
            </>}
        </Main>
    )

}

const BackButton = styled.button`
    position:absolute;
    top:20px;
    left:20px;
    border: #FD9951;
    background-color: #FD9951;
    border-radius: 1rem;
    cursor: pointer;
    color: #fff;
    padding: 1.5rem;
    margin: 24px 12px 12px 12px;
    font-weight: 600;
    font-size: 1.6rem;

    &:hover{
        border: solid 1.5px #FD9951;
        color: #FD9951;
        background: transparent;
    }

`
 const Main = styled.main`
    width: 100%;
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
 `
 const BigContainer = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const SmallContainer = styled.div`
  display:flex;
  flex-direction: column;
  align-items:center;
  gap: 20px;
  padding:10px;
  
  @media (min-width: 768px) {
 
   flex-direction: row;
   justify-content:center;
   
  }

  @media (min-width: 1025px) {
    width: 1000px;
   }
`
 const ImageContainer = styled.div`
      overflow:hidden;

   @media (min-width: 768px) {
    width: 600px;

   }
 `

 const Img = styled.img`
    width:100%;
    height:100%;
    object-fit: cover;
 `

 const TextContainer = styled.div`
   display:flex;
   flex-direction: column;
   width: 200px;
   box-sizing: border-box;
   padding: 2rem;

   @media (min-width: 768px) {
    align-self: flex-start;
    gap: 2rem;
    width:400px;
   } 
 `

 const ProfileTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  margin:0;
  color: #000;


  @media (min-width: 768px) {
    font-size: 3.2rem;
  }
`

const ProfileText = styled.div`
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 10px;
  margin:0;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 1.6rem;
    display: flex;
    flex-direction: row;
    gap: 4rem;
   }
`

const ProfileTag = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
`

const ProfileDetail = styled(ProfileTag)`
   span {
       color: #333;
   }
`

const SpanBold = styled.span`
   font-weight: 700;
`

const ReviewContainer = styled.div`
    margin-top: 10rem;
    height: 300px;
    border-top: solid 0.5px #000;
    overflow: scroll;

`

const Reviews = styled.div`
  width: 100%;
  height: 14rem;
  padding: 4rem 2rem;
  box-sizing: border-box;
  border-bottom: solid 0.5px #D1D0D0;
  display: flex;
  flex-direction: row;
  gap: 2rem;

  div {
      width: 20rem;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
  }

  p {
    margin: 0 0 1rem 0;
    font-size: 1.6rem;
  }
`
 

const ReviewText = styled.p`
    color: #333;
    display: ${props => props.display};
`

const Name = styled.p`
  font-size: 2.4rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
`

const Form = styled.form`
    display: flex;
    margin-top: 4rem;
`

const SubmitBtn = styled.button`
    background-color: #000;
    color: #fff;
    border: none;
    padding: 1rem;
    display: ${props => props.display === '' ? 'none' : 'inline'};
    width: 12rem;
    height: 4rem;
    cursor: pointer;
    transition: all 1s ease;

`

const ReviewInput = styled.textarea`
    border: transparent;
    border-bottom: solid 0.5px #000;
    outline: none;
    width: ${props => props.width === '' ? '100%' : '70%'};
    font-size: 1.4rem;
    transition: all 1s ease;

    &:hover {
    }
`
const ReviewHead = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8rem;
    
    `

const Buttons = styled.div`
    display: inline;
    `

const EditBtn = styled.button`
    display: ${props => props.display};
    background: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;

    &:hover {
        font-size: 2.2rem;
        color: #ec8941;
    }

`

const SendEmail = styled.a`
    font-size: 1.8rem;
    font-weight: 700;
    width: fit-content;
    border-radius: 10px;
    padding: 10px;
    background-color: transparent;
    border: solid 1.5px #4C956C;
    color: #4C956C;
    display: flex;
    justify-content:center;
    align-items: center;
    text-decoration:none;

    &:hover{
        background-color: #4C956C;
        color: #FEFEE3;
        cursor:pointer;
    }

`