import { MessageEmbed } from "discord.js";
import { Command } from "interfaces";
import { injectable } from "inversify";
import { CommandRunOptions } from "types";
import { getCurrentWeather } from "./api";

@injectable()
export class WeatherCommand implements Command {
  readonly name = "weather";
  readonly description = "Погода в любом (нормальном) населенном пункте.";
  readonly syntax = "nameOfCity?";
  readonly defaultValue = "Omsk";
  private readonly K = 273.15;

  async getWeatherMessage(city: string) {
    const currentWeather = await getCurrentWeather(city);
    const weatherMessage = new MessageEmbed();

    const temp = Math.round(currentWeather.data.main.temp - this.K);
    const showTemp = temp > 0 ? "+" + temp : temp;

    const feels = Math.round(currentWeather.data.main.feels_like - this.K);
    const showFeels = feels > 0 ? "+" + feels : feels;

    weatherMessage
      .setColor("#06e3fc")
      .setTitle(`${city}: `)
      .setDescription(
        `Сейчас: **_${showTemp}_** °C
          --------------------------------------------------
          Ощущается: **_${showFeels}_** °C
          Ветер: **_${currentWeather.data.wind.speed}_** м/с
          `
      )
      .setThumbnail(
        `http://openweathermap.org/img/w/${currentWeather.data.weather[0].icon}.png`
      );

    return weatherMessage;
  }

  async run({ args, message }: CommandRunOptions) {
    try {
      if (!args?.length) {
        message.channel.send({
          embeds: [await this.getWeatherMessage(this.defaultValue)],
        });
      } else {
        message.channel.send({
          embeds: [await this.getWeatherMessage(args[0])],
        });
      }
    } catch (e) {
      const errorMessage = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Ошибка!")
        .setDescription(`Упс! Либо ты название своего колхоза не знаешь, либо сервак не отвечает.
        Но сервак омереканский - значит хороший, поэтому попробуй еще раз...`);

      message.channel.send({ embeds: [errorMessage] });

      console.log(e);
    }
  }
}
