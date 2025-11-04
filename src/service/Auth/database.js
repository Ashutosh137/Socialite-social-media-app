import { auth, firestore, storage } from ".";
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy,
} from "firebase/firestore";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const user = collection(firestore, "user");

export const Create_Account = async ({
  email,
  uid,
  bio,
  name,
  age,
  username,
  profileimg,
}) => {
  try {
    await addDoc(user, {
      email: email,
      name: name,
      uid: uid,
      dateofbirth: age,
      bio: bio,
      report: [],
      restricted: false,
      privacy: false,
      profileImageURL: profileimg,
      notification: 0,
      createdAt: new Date(),
      follower: [],
      following: [],
      blockusers: [],
      saved: [],
      username: username,
      post: [],
    });
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong , Please login Again");
  }
};
export const Create_notification = async (uid, intent) => {
  try {
    // Create notification in database
    await addDoc(collection(firestore, "notification"), {
      uid: uid,
      intent: intent,
      time: new Date(),
    });

    // Send email notification asynchronously
    sendNotificationEmailAsync(uid, intent).catch((emailError) => {
      // Log email error but don't fail notification creation
      console.error("Error sending notification email:", emailError);
    });
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

/**
 * Helper function to send email notification
 * Runs asynchronously to not block notification creation
 */
const sendNotificationEmailAsync = async (uid, intent) => {
  try {
    // Get recipient user data
    const recipientUser = await get_userdata(uid);
    if (!recipientUser?.email) {
      console.warn("No email address found for user:", uid);
      return;
    }

    // Get actor user data for email content
    let actorUser = null;
    if (intent?.likeby) {
      actorUser = await get_userdata(intent.likeby);
    }

    // Import email service dynamically to avoid blocking
    const { sendNotificationEmail } = await import("../email/emailService.js");
    
    // Build post URL if postid exists
    let postUrl = "";
    if (intent?.postid) {
      if (actorUser?.username) {
        postUrl = `${window.location.origin}/profile/${actorUser.username}/${intent.postid}`;
      } else if (recipientUser?.username) {
        postUrl = `${window.location.origin}/profile/${recipientUser.username}/${intent.postid}`;
      }
    }

    // Send email notification
    await sendNotificationEmail(
      recipientUser.email,
      intent.type,
      {
        actorName: actorUser?.name || "Someone",
        actorUsername: actorUser?.username || "",
        recipientName: recipientUser?.name || "User",
        postUrl: postUrl,
        postContent: intent?.postContent || "",
      }
    );
  } catch (error) {
    console.error("Error in sendNotificationEmailAsync:", error);
    throw error;
  }
};

export const get_userdata = async (uid) => {
  try {
    const q = await query(user, where("uid", "==", uid));
    const doc_refs = await getDocs(q);
    const res = [];
    doc_refs.forEach((country) => {
      res.push({
        ...country.data(),
      });
    });
    return res[0];
  } catch (err) {
    console.error(err);
  }
};
export const Get_notification = async (uid) => {
  try {
    const q = await query(
      collection(firestore, "notification"),
      where("uid", "==", uid),
      orderBy("time", "desc"),
    );
    const doc_refs = await getDocs(q);
    const res = [];
    doc_refs.forEach((country) => {
      res.push({
        ...country.data(),
      });
    });

    return res;
  } catch (err) {
    console.error(err);
  }
};
export const get_userdatabyname = async (username) => {
  try {
    const q = await query(user, where("username", "==", username.trim()));
    const doc_refs = await getDocs(q);
    const res = [];
    doc_refs.forEach((country) => {
      res.push({
        ...country.data(),
      });
    });
    return res[0];
  } catch (err) {
    console.error(err);
  }
};

export const getpostdata = async (username, postid) => {
  try {
    var res = [];
    const data = await get_userdatabyname(username);
    await data?.post.map((pot) => {
      if (postid === pot.postid) {
        res.push(pot);
      }
    });
    return res[0];
  } catch (err) {
    console.error("Error: Post not found");
  }
};
export const getpostdatabyuid = async (uid, postid) => {
  try {
    var res = [];
    const data = await get_userdata(uid);
    await data?.post.map((pot) => {
      if (postid === pot.postid) {
        res.push(pot);
      }
    });
    return res[0];
  } catch (err) {
    console.log(err);
  }
};

export const updateuserdata = async (userdata) => {
  try {
    const q = await query(user, where("uid", "==", userdata.uid));
    const doc_refs = await getDocs(q);
    var docid;
    doc_refs.forEach((country) => {
      docid = country.id;
    });

    await updateDoc(doc(firestore, `user/${docid}`), userdata);
  } catch (err) {
    console.error(err);
  }
};
export const updateprofileuserdata = async (userdata, username) => {
  try {
    const q = await query(user, where("username", "==", username));
    const doc_refs = await getDocs(q);
    var docid;
    doc_refs.forEach((country) => {
      docid = country.id;
    });

    await updateDoc(doc(firestore, `user/${docid}`), userdata);
  } catch (err) {
    console.error(err);
  }
};
export const getallpost = async () => {
  try {
    const q = await query(user, where("privacy", "==", false));
    const doc_refs = await getDocs(q);
    const res = [];
    doc_refs.forEach((country) => {
      res.push(country.data().post);
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};
export const getallprofile = async () => {
  try {
    const q = await query(user, where("privacy", "==", false));
    const doc_refs = await getDocs(q);
    const res = [];
    doc_refs.forEach((country) => {
      res.push(country.data());
    });

    res.sort();
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const check_data_is_exist = async (uid) => {
  try {
    const data = await get_userdata(uid);
    return !!data;
  } catch (err) {
    console.error(err);
  }
};
export const check_username_is_exist = async (username) => {
  try {
    return await get_userdatabyname(username);
  } catch (err) {
    console.error(err);
  }
};
export const Getimagedownloadlink = async (image) => {
  try {
    if (image === null) {
      return null;
    }
    const imageUrl = await new Promise((resolve, reject) => {
      try {
        const storageRef = ref(
          storage,
          `${auth.currentUser.uid}/${image.name}`,
        );
        const uploadTask = uploadBytesResumable(storageRef, image);
        toast.info("image is being uploading");
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("Error during upload:", error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              console.error("Error getting download URL:", error);
              reject(error);
            }
          },
        );
      } catch (error) {
        console.log(error);
        resolve(null);
      }
    });
    return imageUrl;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updatepost = async (post, postedby) => {
  try {
    const q = await query(user, where("uid", "==", postedby));
    const doc_refs = await getDocs(q);
    var docid;

    doc_refs.forEach(async (country) => {
      docid = country.id;
      var postdata = country.data().post;
      postdata.map(async (currentpost, index) => {
        if (post.postid === currentpost.postid) {
          postdata[index] = post;
          await updateDoc(doc(firestore, `user/${docid}`), {
            post: postdata,
          });
        }
      });
    });
  } catch (err) {
    console.log(err, "error in update post");
  }
};
