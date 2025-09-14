import { Body, Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SummaryQueryDto } from './dto/overview.dto.';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ApiResponse } from 'src/common/types/api-response.type';
import { FinanceDashboardService } from './finance-dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class FinanceDashboardController {
  constructor(private readonly dashboardService: FinanceDashboardService) {}

  /** Get summary grouped by category */
  @Get('overview')
  async getSummary(
    @GetUser() user: User,
    @Query() query: SummaryQueryDto,
  ): Promise<
    ApiResponse<{
      income: { category: string; total: number }[];
      expense: { category: string; total: number }[];
      total: { income: number; expense: number };
    }>
  > {
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (query.startDate) {
      // Convert YYYY-MM-DD → start of day ISO string
      startDate = new Date(`${query.startDate}T00:00:00`).toISOString();
    }

    if (query.endDate) {
      // Convert YYYY-MM-DD → end of day ISO string
      endDate = new Date(`${query.endDate}T23:59:59`).toISOString();
    }

    const summary = await this.dashboardService.getOverview(
      user,
      startDate,
      endDate,
    );

    return {
      success: true,
      message: 'Transaction summary fetched successfully',
      data: summary,
    };
  }
}
