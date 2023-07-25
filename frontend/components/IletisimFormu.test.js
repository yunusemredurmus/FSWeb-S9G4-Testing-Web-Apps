import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("IletisimFormu bileşeni hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
  expect(screen.getByText("İletişim Formu")).toBeInTheDocument();
});

test("IletisimFormu bileşeni headerı render ediliyor", () => {
  render(<IletisimFormu />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

test("Kullanıcı adını 5 karakterden az girdiğinde bir hata mesajı render ediliyor", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const submitButton = screen.getByText("Gönder");

  userEvent.type(adInput, "ABC");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
    ).toBeInTheDocument();
  });
});

test("Kullanıcı inputları doldurmadığında üç hata mesajı render ediliyor", async () => {
  render(<IletisimFormu />);
  const submitButton = screen.getByText("Gönder");

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Hata: Ad gereklidir.")).toBeInTheDocument();
    expect(screen.getByText("Hata: Soyad gereklidir.")).toBeInTheDocument();
    expect(screen.getByText("Hata: Email gereklidir.")).toBeInTheDocument();
  });
});

test("Kullanıcı doğru ad ve soyad girdiğinde, fakat email girmediğinde bir hata mesajı render ediliyor", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const soyadInput = screen.getByLabelText("Soyad*");
  const submitButton = screen.getByText("Gönder");

  userEvent.type(adInput, "İlhan");
  userEvent.type(soyadInput, "Mansız");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Hata: Email gereklidir.")).toBeInTheDocument();
  });
});

test('Geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const emailInput = screen.getByLabelText("Email*");
  const submitButton = screen.getByText("Gönder");

  userEvent.type(emailInput, "gecersizemail");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText("Hata: Email geçerli bir email adresi olmalıdır.")
    ).toBeInTheDocument();
  });
});

test('Soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const submitButton = screen.getByText("Gönder");

  userEvent.type(adInput, "İlhan");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Hata: Soyad gereklidir.")).toBeInTheDocument();
  });
});

test("Ad, soyad, email render ediliyor. Mesaj bölümü doldurulmadığında hata mesajı render edilmiyor", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const soyadInput = screen.getByLabelText("Soyad*");
  const emailInput = screen.getByLabelText("Email*");
  const submitButton = screen.getByText("Gönder");

  userEvent.type(adInput, "İlhan");
  userEvent.type(soyadInput, "Mansız");
  userEvent.type(emailInput, "iletisim@example.com");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.queryByText("Hata: Mesaj gereklidir.")
    ).not.toBeInTheDocument();
  });
});

test("Form gönderildiğinde girilen tüm değerler render ediliyor", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const soyadInput = screen.getByLabelText("Soyad*");
  const emailInput = screen.getByLabelText("Email*");
  const mesajInput = screen.getByLabelText("Mesaj");
  const submitButton = screen.getByText("Gönder");

  userEvent.type(adInput, "İlhan");
  userEvent.type(soyadInput, "Mansız");
  userEvent.type(emailInput, "iletisim@example.com");
  userEvent.type(mesajInput, "Merhaba, bu bir test mesajıdır.");
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByTestId("firstnameDisplay")).toHaveTextContent(
      "Ad: İlhan"
    );
    expect(screen.getByTestId("lastnameDisplay")).toHaveTextContent(
      "Soyad: Mansız"
    );
    expect(screen.getByTestId("emailDisplay")).toHaveTextContent(
      "Email: iletisim@example.com"
    );
    expect(screen.getByTestId("messageDisplay")).toHaveTextContent(
      "Mesaj: Merhaba, bu bir test mesajıdır."
    );
  });
});