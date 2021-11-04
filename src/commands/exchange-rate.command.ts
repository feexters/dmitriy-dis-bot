import { MessageEmbed } from "discord.js";
import { Command } from "interfaces";
import { CommandRunOptions, ValuteModelDto } from "types";
import { injectable } from "inversify";
import { getExchangeRate } from "./api";
const icons = require("../data/icons-of-countries.json");

@injectable()
export class ExchangeRateCommand implements Command {
  readonly name = "курс";
  readonly description = "Получить текущий курс валюты";
  readonly defaultValue = ["USD", "EUR", "KZT", "UAH"];
  readonly args = "...listOfCountries?";

  private async getCashMessage(names: string[]) {
    const {
      data: { Valute: currentRate },
    } = await getExchangeRate();
    const cashMessage = new MessageEmbed();

    const findKeys = this.searchCountries(names, Object.values(currentRate));

    return cashMessage
      .setColor("#9500df")
      .setTitle(`Курс валют на сегодня :money_with_wings: : `)
      .setDescription(
        findKeys.reduce((accum, name) => {
          if (name && currentRate[name]) {
            return (
              accum +
              `${name} ${
                icons[name] ? ":" + icons[name].icon + ":" : ""
              }: **_${this._rounded(
                currentRate[name].Value / currentRate[name].Nominal
              )}_** руб. ${
                currentRate[name].Value > currentRate[name].Previous
                  ? " ▲"
                  : " ▼"
              }
              --------------------------------------------------
          `
            );
          } else {
            return accum;
          }
        }, "")
      )
      .setFooter("© ЦБ России");
  }

  private searchCountries = (
    values: string[],
    countriesList: ValuteModelDto[]
  ) => {
    const findKeys = values.reduce<string[]>((accum, name) => {
      const countries = countriesList.reduce<string[]>((list, country) => {
        if (country.CharCode.toLowerCase().includes(name.toLowerCase())) {
          return [...list, country.CharCode];
        } else if (country.Name.toLowerCase().includes(name.toLowerCase())) {
          return [...list, country.CharCode];
        } else {
          return list;
        }
      }, []);

      return [...accum, ...countries];
    }, []);

    return findKeys;
  };

  async run({ args, message }: CommandRunOptions) {
    try {
      if (!args?.length) {
        message.channel.send({
          embeds: [await this.getCashMessage(this.defaultValue)],
        });
      } else {
        message.channel.send({ embeds: [await this.getCashMessage(args)] });
      }
    } catch (error) {
      console.log(error);
      message.channel.send("Упс, что-то пошло не так...");
    }
  }

  private _rounded(number: number) {
    return Math.round(number * 100) / 100;
  }
}
