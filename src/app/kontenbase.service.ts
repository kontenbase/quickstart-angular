import { Injectable } from '@angular/core';
import { createClient } from '@kontenbase/sdk';
import { environment } from 'src/environments/environment';

interface Profile {
  company: string;
  location: string;
  position: string;
  website?: string;
}

@Injectable({ providedIn: 'root' })
export class KontenbaseService {
  private kontenbase;

  constructor() {
    this.kontenbase = createClient({
      apiKey: environment.kontenbaseApiKey,
    });
  }

  get user() {
    return this.kontenbase.auth.user();
  }

  login(username: string, password: string) {
    return this.kontenbase.auth.login({
      // @ts-ignore
      username,
      password,
    });
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) {
    return this.kontenbase.auth.register({
      firstName,
      lastName,
      email,
      // @ts-ignore
      username,
      password,
    });
  }

  createProfile(userId: string) {
    return this.kontenbase.service('profile').create({
      Users: [userId],
    });
  }

  getOwnProfile() {
    return this.kontenbase.auth.user({
      lookup: '*',
    });
  }
  updateUser(firstName: string, lastName: string, phoneNumber: string) {
    return this.kontenbase.auth.update({ firstName, lastName, phoneNumber });
  }

  uploadImage(file: string) {
    return this.kontenbase.storage.upload(file);
  }

  updateImage(profileId: string, image: string | undefined) {
    return this.kontenbase.service('profile').updateById(profileId, {
      image,
    });
  }

  updateProfile(
    id: string,
    company: string,
    location: string,
    position: string,
    website: string
  ) {
    let profileData: Profile = {
      company: '',
      location: '',
      position: '',
    };
    profileData.company = company;
    profileData.location = location;
    profileData.position = position;

    if (website !== '') {
      profileData.website = website;
    }

    return this.kontenbase.service('profile').updateById(id, profileData);
  }

  getProfileByUsername(username: string | undefined) {
    return this.kontenbase.service('Users').find({
      where: {
        username,
      },
      lookup: '*',
    });
  }

  logout() {
    return this.kontenbase.auth.logout();
  }
}
