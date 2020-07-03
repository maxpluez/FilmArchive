/* eslint-disable no-console */
/* eslint-disable compat/compat */
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react'
// import Banner from './Banner'
import { View, ContextView } from '@instructure/ui-view'
import { DrawerLayout } from '@instructure/ui-drawer-layout'
import { Avatar } from '@instructure/ui-avatar'
import { AppNav } from '@instructure/ui-navigation'
import { Img } from '@instructure/ui-img'
import { Text } from '@instructure/ui-text'
import { Button, CloseButton, CondensedButton, IconButton } from '@instructure/ui-buttons'
import { Heading } from '@instructure/ui-heading'
import { Rating } from '@instructure/ui-rating'
import { IconAddLine, IconUserLine, IconCheckLine } from '@instructure/ui-icons'
import { FormFieldGroup, FormField } from '@instructure/ui-form-field'
import { TextInput } from '@instructure/ui-text-input'
import { TextArea } from '@instructure/ui-text-area'
import { NumberInput } from '@instructure/ui-number-input'
import { FileDrop } from '@instructure/ui-file-drop'
import { SimpleSelect } from '@instructure/ui-simple-select'
import { Billboard } from '@instructure/ui-billboard'

import axios from 'axios'
import requirejs from 'requirejs'

/*
requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
})
*/

import '@instructure/canvas-theme'

const App = () => {
    const [filmSelected, setFilmSelected] = React.useState(localStorage.getItem('filmSelected') || false)
    const [tvSelected, setTVSelected] = React.useState(localStorage.getItem('tvSelected') || false)
    const setFilm = event => {
        setFilmSelected(true)
        setTVSelected(false)
        localStorage.setItem('filmSelected', true)
        localStorage.setItem('tvSelected', false)
    }

    const setTV = event => {
        setTVSelected(true)
        setFilmSelected(false)
        localStorage.setItem('filmSelected', false)
        localStorage.setItem('tvSelected', true)
    }

    const reset = event => {
        setFilmSelected(false)
        setTVSelected(false)
        localStorage.setItem('filmSelected', false)
        localStorage.setItem('tvSelected', false)
    }

    const [films, setFilms] = React.useState([{title: "hahaha"}, {title: "another film"}])
    const [tvs, setTVs] = React.useState([{title: "hahaha"}, {title: "another tv show"}])

    const [addingFilm, setAddingFilm] = React.useState(false)

    const [userShown, setUserShown] = React.useState(false)

    const showUser = event => {
        if (userShown) {
            setUserShown(false)
        } else {
            setUserShown(true)
        }
    }

    let profile = null
    if (userShown) {
        profile = <div style={{position: 'fixed', top: '6.67%', right:'11px', zIndex: '100', color: 'white', textAlign: 'center'}}>
            <ContextView
                placement='bottom end'
                padding="medium"
            >
                <div style={{padding:'auto'}}>
                    <Avatar name='Max' display='block' margin='auto' />
                </div>
                <br />
                <div style={{padding:'auto'}}>
                    <Text textAlign='center' margin='auto'>User info ...</Text>
                </div>
            </ContextView>
        </div>
    }

    React.useEffect(() => {
        axios.get('http://localhost:9000/api').then(res => {
            setFilms(res.data)
        }).catch(err => {
            console.log(err)
            console.log(err.response.data)
        })
    }, [filmSelected, addingFilm])

    return (
        <div style={{height: '100%'}}>
            <TopNav
                setFilm={setFilm}
                setTV={setTV}
                reset={reset}
                showUser={showUser}
            />
            {profile}
            <Home
                isFilm={filmSelected}
                isTV={tvSelected}
                films={films}
                tvs={tvs}
                addingFilm={addingFilm}
                setAddingFilm={setAddingFilm}
            />
        </div>
    )
}

import archiveIcon from '../public/images/icon1.jpg'

const TopNav = ({setFilm, setTV, reset, showUser}) => {
    return (
      <AppNav
        screenReaderLabel="App navigation"
        visibleItemsCount={4}
        renderBeforeItems={
            <AppNav.Item
                // eslint-disable-next-line react/jsx-no-undef
                renderLabel={<div></div>}
                renderIcon={<Avatar name="Archive" src={archiveIcon} shape="rectangle" />}
                onClick={reset}
            />
        }
        renderAfterItems={
            <AppNav.Item
                renderLabel={<div></div>}
                renderIcon={<IconButton screenReaderLabel="profile" color='primary'><IconUserLine /></IconButton>}
                onClick={showUser}
            />
        }
      >
        <AppNav.Item
          renderLabel="Films"
          onClick={setFilm}
        />
        <AppNav.Item
          renderLabel="TV Shows"
          onClick={setTV}
        />
      </AppNav>
    )
}

import avengerSrc from '../public/images/avengers.png'

const Home = ({isFilm, isTV, films, tvs, addingFilm, setAddingFilm}) => {
    const [open, setOpen]  = React.useState(false)
    const handleTrayDismiss = () => {
        setOpen(false)
    }
    const handleTrayOpen = () => {
        setOpen(true)
    }

    let trayButton = null
    if (open) {
        trayButton = <View height='xx-large'></View>
    } else {
        trayButton = <View>
                        <IconButton
                            screenReaderLabel='Tray'
                            onClick={handleTrayOpen}
                            color='primary'
                        >
                            <IconAddLine />
                        </IconButton>
                        <br /><br />
                    </View>
    }

    const [selection, setSelection] = React.useState(JSON.parse(localStorage.getItem('selection')) || {_id: "", title: "", description: "", rating: 0, img: ""})
    const select = event => {
        const curr_selection_arr = films.filter(film => film.title == event.target.innerText)
        const curr_selection = curr_selection_arr[0]
        setSelection(curr_selection)
        localStorage.setItem('selection', JSON.stringify(curr_selection))
    }

    const handleAdd = event => {
        setAddingFilm(true)
    }

    let main = <Selection selection={selection} />
    if (addingFilm) {
        main = <AddFilmForm setAddingFilm={setAddingFilm} setSelection={setSelection}/>
    }

    if (!isFilm && !isTV){
        return (
            <View display="flex" background="primary-inverse" height='93.3%'>
                <Img src={avengerSrc} margin="xx-large"/>
                <View margin="xx-large small" textAlign="center">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <Text size="xx-large" weight="bold">Film and TV Archive</Text><br /><br />
                    <Text size="x-large">Click links in navigation to start...</Text>
                </View>
            </View>
        )
    } else if (isFilm) {
        return (
            <View
                height='93.3%'
                as="div"
                background="primary-inverse"
                position="relative"
            >
                <DrawerLayout>
                    <DrawerLayout.Tray
                        id="DrawerLayoutTrayExample1"
                        open={open}
                        placement="start"
                        label="Drawer Tray Start Example"
                        onDismiss={handleTrayDismiss}
                    >
                        <View
                            as="div"
                            maxWidth="16rem"
                            textAlign="center"
                            margin="large auto"
                            padding="small"
                        >
                            <CloseButton
                                placement="end"
                                offset="small"
                                onClick={handleTrayDismiss}
                                screenReaderLabel="Close"
                            />
                            {
                                films.map(film => (
                                    // eslint-disable-next-line react/jsx-key
                                    <CondensedButton
                                        display='block'
                                        size='large'
                                        onClick={select}
                                    >
                                        <Text>{film.title}</Text>
                                    </CondensedButton>
                                ))
                            }
                            <br /><br />
                            <IconButton
                                screenReaderLabel='Add'
                                onClick={handleAdd}
                                color='primary'
                                shape='circle'
                            >
                                <IconAddLine />
                            </IconButton>
                        </View>
                    </DrawerLayout.Tray>
                    <DrawerLayout.Content label="Drawer content example">
                        <div style={{height: '100%'}}>
                            <View as="div" padding="x-large">
                                {trayButton}
                                {main}
                            </View>
                        </div>
                    </DrawerLayout.Content>
                </DrawerLayout>
            </View>
        )
    } else {
        return (
            <View>
                {tvs.map(tv => (
                    // eslint-disable-next-line react/jsx-key
                    <View><Text>{tv.title}</Text><br /></View>
                ))}
            </View>
        )
    }
}

const Selection = ({selection}) => {
    if (selection.title == "") {
        return(
            <View>
                <Text size='xx-large'>Open the menu and select a film to begin...</Text>
            </View>
        )
    }
    let imgSrc = null
    let imgElement = null
    if (selection.img && selection.img != "") {
        try{
            imgSrc = require(`../../api/public/images/uploads/${selection.img}`)
            imgElement = <Img src={imgSrc} display='block' />
        } catch (e) {
            imgElement = <Billboard heading="Refresh Page to See Image!"/>
        }
    }

    return (
        <View>
            <View display='block'>
                <Heading border="bottom">{selection.title}</Heading>
                <Rating
                    label="rating"
                    animateFill
                    iconCount={5}
                    valueNow={selection.rating}
                    valueMax={10}
                />
            </View>
            <br />
            <View display='block'>
                {imgElement}
                <Text size="large">
                    <p>{selection.description}</p>
                </Text>
            </View>
        </View>
    )
}

const AddFilmForm = ({setAddingFilm, setSelection}) => {
    const [title, setTitle] = React.useState("")
    const [des, setDes] = React.useState("")
    const [rating, setRating] = React.useState(0)
    const [img, setImg] = React.useState({name: ""})

    const handleTitleChange = event => {
        setTitle(event.target.value)
    }
    const handleDesChange = event => {
        setDes(event.target.value)
    }
    const handleRatingChange = event => {
        setRating(parseInt(event.target.innerText))
    }
    const handleFileAccepted = event => {
        setImg(event[0])
        //console.log(event[0])
    }
    const handleFileRejected = event => {
        console.log("File Not Accepted!")
    }
    let insideDrop = <Billboard heading="Upload your image" message="Drag and drop, or click to browse your computer" />
    if (img.name!="") {
        insideDrop = <Billboard heading="Image accepted" message={img.name} />
    }

    const handleSubmit = event => {
        let submissionPromise = new Promise((resolve, reject) => {
            let headers = {
                'Content-Type': "multipart/form-data"
            }
            let data = new FormData()
            data.append('title', title)
            data.append('des', des)
            data.append('rating', rating)
            data.append('file', img)
            // How to fix this please help it automatically refreshes the whole app
            axios.post('http://localhost:9000/api', data, {headers:headers}).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
        submissionPromise.then(res => {
            setSelection(res)
            localStorage.setItem('selection', JSON.stringify(res))
            setAddingFilm(false)
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <View background='primary-inverse'>
        <FormFieldGroup
            description="AddFilm"
            rowSpacing="medium"
            vAlign="middle"
        >
            <TextInput
                renderLabel={<Text color='primary-inverse'>Title:</Text>}
                onChange={handleTitleChange}
            />
            <TextArea
                label={<Text color='primary-inverse'>Description:</Text>}
                onChange={handleDesChange}
            />
            <SimpleSelect
                renderLabel={<Text color='primary-inverse'>Select rating:</Text>}
                onChange={handleRatingChange}
            >
                <SimpleSelect.Option id={1} value={1}>
                    1
                </SimpleSelect.Option>
                <SimpleSelect.Option id={2} value={2}>
                    2
                </SimpleSelect.Option>
                <SimpleSelect.Option id={3} value={3}>
                    3
                </SimpleSelect.Option>
                <SimpleSelect.Option id={4} value={4}>
                    4
                </SimpleSelect.Option>
                <SimpleSelect.Option id={5} value={5}>
                    5
                </SimpleSelect.Option>
                <SimpleSelect.Option id={6} value={6}>
                    6
                </SimpleSelect.Option>
                <SimpleSelect.Option id={7} value={7}>
                    7
                </SimpleSelect.Option>
                <SimpleSelect.Option id={8} value={8}>
                    8
                </SimpleSelect.Option>
                <SimpleSelect.Option id={9} value={9}>
                    9
                </SimpleSelect.Option>
                <SimpleSelect.Option id={10} value={10}>
                    10
                </SimpleSelect.Option>
            </SimpleSelect>
            <FileDrop
                accept='image/*'
                renderLabel={insideDrop}
                display='block'
                onDropAccepted={handleFileAccepted}
                onDropRejected={handleFileRejected}
                shouldEnablePreview={true}
            />
        </FormFieldGroup>
        <Button
                renderIcon={IconCheckLine}
                withBackground={false}
                color="primary-inverse"
                margin="small"
                display='block'
                onClick={handleSubmit}
                type='reset'
            >
                Submit
        </Button></View>
    )
}

export default App
