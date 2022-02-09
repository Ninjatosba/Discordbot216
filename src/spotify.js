const axios = require('axios');
const { config } = require('dotenv');
const qs = require('qs');

class Spotify {

    _accessToken = 'PLACEHOLDER_ACCESS_TOKEN'

    constructor(clientId, clientSecret, refreshToken , playlistId) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._refreshToken = refreshToken;
        this._playlistId = playlistId
    }

    async _fetchRefreshedAccessToken() {
        const data = qs.stringify({
            'grant_type': 'refresh_token',
            'refresh_token': this._refreshToken
        });
        const requestConfig = {
            method: 'post',
            url: 'https://accounts.spotify.com/api/token?redirect_uri=https://oauth.pstmn.io/v1/browser-callback ',
            headers: {
                'Authorization': 'Basic MjEwYmExZmIyYTkzNDUxYmEyNmIwMjljYzMwNjhmYTE6ZmNlMDYwNzJkMzhhNDdmODg2MDU0ZDRlODhkY2JlZGQ=',
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            data: data
        };
        return axios(requestConfig)
            .then((response) => response.data.access_token)
            .catch((error) => {
                console.log(error);
            });
    }

    async getTrackDataFromUrl(urlString) {
        let url = new URL(urlString);
        const { host, pathname } = url;
        const [trackPath, trackId] = pathname.split('/').filter(String);
        if (host === 'open.spotify.com' && trackPath === 'track')
            return await this._fetchTrackData(trackId);
        else
            throw new Error('Invalid song link!')
    }

    async _fetchTrackData(trackId) {
        let requestConfig = {
            method: 'get',
            url: `https://api.spotify.com/v1/tracks/${trackId}`,
            headers: {
                'Authorization': `Bearer ${this._accessToken}`
            }
        };
        return axios(requestConfig)
            .then((response) => {
                const data = response.data;
                return {
                    uri: data.uri,
                    name: data.name,
                    artists: data.artists.map(artist => artist.name)
                }
            })
            .catch(async (error) => {
                if (error.response.status === 401) {
                    this._accessToken = await this._fetchRefreshedAccessToken().catch(e => console.error(e));
                    return this._fetchTrackData(trackId);
                }
                throw error;
            });
    }

    async addTrackToPlaylist(trackUri,) {
        let requestConfig = {
            method: 'post',
            url: `https://api.spotify.com/v1/playlists/${this._playlistId}/tracks?uris=${trackUri}`,
            headers: {
                'Authorization': `Bearer ${this._accessToken}`
            }
        };
        return axios(requestConfig)
            .then((response) => {
                console.log('Song Added Successfully!');
            })
            .catch(async (error) => {
                if (error.response.status === 401) {
                    this._accessToken = await this._fetchRefreshedAccessToken().catch(e => console.error(e));
                    return this.addTrackToPlaylist(trackUri, playlistId).catch(e => console.error(e));
                } else {
                    console.error(error);
                }
            });
    }

}

module.exports = { Spotify }
