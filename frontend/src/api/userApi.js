import axios from "axios";
import { API_SERVER_HOST } from "./config";
import jwtAxios from "../utill/jwtUtill";

const host = `${API_SERVER_HOST}/api/user`;

export const loginPost = async (loginParam) => {
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.loginId);
  form.append("password", loginParam.password);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

export const posstCode = async (code) => {
  const head = { headers: { "Content-Type": "application/json" } };
  const res = await axios.post(`${host}/mail`, code, head);

  return res.data;
};

export const postAdd = async (join) => {
  const head = { headers: { "Content-Type": "application/json" } };

  const res = await axios.post(`${host}/signup`, join, head);

  return res.data;
};

// 전체 회원 조회
export const getAllUsers = async () => {
  const res = await jwtAxios.get(`${host}/list`);
  return res.data;
};

// 특정 회원 조회
export const getUserById = async (id) => {
  const res = await jwtAxios.get(`${host}/${id}`);
  return res.data;
};

//회원 정보 수정
export const updateUser = async (id, user) => {
  const head = { headers: { "Content-Type": "application/json" } };
  const res = await jwtAxios.put(`${host}/${id}`, user, head);
  return res.data;
};

//회원 탈퇴
export const deleteUser = async (id) => {
  const res = await jwtAxios.delete(`${host}/${id}`);
  return res.data;
};
